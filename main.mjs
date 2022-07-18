import path from 'path'
import crypto from 'crypto'
import ejs from 'ejs'
import express from 'express'
import morgan from 'morgan'
import basicAuth from 'basic-auth-connect'
import nocache from 'nocache'
import helmet from 'helmet'
import {makeLogger} from './util/logging.mjs'
import winston from 'winston'
import {Op, QueryTypes} from 'sequelize'
import model from './model/index.mjs'
import * as c from './lib/convert.mjs'
import * as f from './lib/form.mjs'
import * as v from './lib/validate.mjs'

main()

async function main () {
  try {
    winston.loggers.add('error', makeLogger(process.env.LOG_LEVEL, 'json', 'error.log'))
    winston.loggers.add('warn', makeLogger(process.env.LOG_LEVEL, 'json', 'warn.log'))
    winston.loggers.add('info', makeLogger(process.env.LOG_LEVEL, 'json', 'info.log'))
    winston.loggers.add('query', makeLogger(process.env.LOG_LEVEL, 'json', 'query.log'))
    winston.loggers.add('access', makeLogger(process.env.LOG_LEVEL, 'raw', 'access.log'))

    const router = express()

    router.set('strict routing', true)
    router.set('views', path.join(process.cwd(), 'view'))
    router.set('view engine', 'ejs')

    router.use(helmet({
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'"],
          "base-uri": ["'self'"],
          "block-all-mixed-content": [],
          "font-src": ["'self'", "https:", "data:"],
          "form-action": ["'self'"],
          "frame-ancestors": ["'self'"],
          "frame-src": ["'self'", "https://www.google.com"],
          "img-src": ["'self'", "data:", "https://storage.googleapis.com", "https:"],
          "object-src": ["'none'"],
          "script-src": ["'self'", process.env.STATIC_URL, "'unsafe-eval'"],
          "script-src-attr": ["'none'"],
          "style-src": ["'self'", "'unsafe-inline'", process.env.STATIC_URL, 'https://fonts.googleapis.com'],
          "upgrade-insecure-requests": [],
          "connect-src": ["'self'", "https://storage.googleapis.com"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }))

    router.use(morgan(process.env.ACCESS_LOG, {
      stream: {
        write: message => {
          winston.loggers.get('access').debug(message.trim())
        }
      }
    }))

    if (process.env.BASIC_AUTH_IS_ENABLED === '1') {
      const username = process.env.BASIC_AUTH_USERNAME
      const password = process.env.BASIC_AUTH_PASSWORD

      router.use(basicAuth(username, password))
    }

    router.use('/static/', express.static(new URL('static', import.meta.url).pathname))
    router.use('/static/', express.static(new URL('node_modules/bootstrap/dist', import.meta.url).pathname))

    router.use('/', wrap(layout))
    router.use('/', wrap(renderFixedPage))
    // router.get('/', (_, res) => res.render('home'))
    router.get('/news/:newsId([0-9]+)/', wrap(news))
    // router.get('/news/:newsId([0-9]+)/', (_, res) => res.render('news'))
    // router.get('/about/', (_, res) => res.render('about'))
    // router.get('/courses/', (_, res) => res.render('courses'))
    // router.get('/courses/commute/', (_, res) => res.render('courses-commute'))
    // router.get('/courses/correspondence/', (_, res) => res.render('courses-correspondence'))
    // router.get('/admission/', wrap(admission))
    // router.get('/admission/', (_, res) => res.render('admission'))
    // router.get('/document/', wrap(document))
    // router.get('/document/', (_, res) => res.render('document'))
    // router.get('/faq/', wrap(faq))
    // router.get('/faq/', (_, res) => res.render('faq'))
    // router.get('/contact/', (_, res) => res.render('contact'))
    // router.get('/contact/review/', (_, res) => res.render('contact-review'))
    // router.get('/contact/finish/', (_, res) => res.render('contact-finish'))
    // router.get('/recruit/', (_, res) => res.render('recruit'))
    // router.get('/privacy/', (_, res) => res.render('privacy'))
    // router.get('/student/', (_, res) => res.render('student'))
    // router.get('/student/document/', wrap(studentDocument))
    // router.get('/student/document/', (_, res) => res.render('student-document'))
    // router.get('/student/faq/', wrap(studentFaq))
    // router.get('/student/faq/', (_, res) => res.render('student-faq'))
    router.use('/api/v1/', express.json())
    router.use('/api/v1/', nocache())
    router.get('/api/v1/contact/initialize', wrap(apiContactInitialize))
    router.post('/api/v1/contact/validate', wrap(apiContactValidate))
    router.post('/api/v1/contact/submit', wrap(apiContactSubmit))

    router.use(onNotFound)
    router.use(onError)

    router.listen(process.env.PORT, () => {
      winston.loggers.get('info').info(`Listening on ${process.env.PORT}`)
    })
  } catch (err) {
    console.error(err.stack)
  }
}

function wrap (fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

async function layout (req, res, next) {
  const {layout} = await findSetting(['layout'])

  req.locals = {}
  res.locals.env = process.env
  res.locals.url = new URL(req.originalUrl, process.env.BASE_URL)
  res.locals.layout = layout

  next()
}

async function renderFixedPage (req, res, next, options) {
  options = options || {}

  const fixedPage = await model.fixedPage.findOne({
    where: {
      code: {[Op.eq]: (options.code || res.locals.url.pathname)},
    },
  })

  if (!fixedPage) {
    next()
    return
  }

  const frontmatter = JSON.parse(fixedPage.frontmatter)
  const functions = {
    findNewses,
    findNews,
    findNewsLinks,
    findNewsImages,
    findAdmissionDocumentCategories,
    findStudentDocumentCategories,
    findAdmissionFaqCategories,
    findStudentFaqCategories,
  }

  for (const local of frontmatter.locals) {
    if (functions[local.function]) {
      const resource = await functions[local.function](req)

      if (local.required && !resource) {
        onNotFound(req, res)
        return
      }

      res.locals[local.name] = resource
    }
  }

  res.locals.setting = await findSetting(frontmatter.settings)
  res.locals.partial = res.locals.partial || {}

  const partials = await model.partial.findAll({
    where: {
      code: {[Op.in]: frontmatter.partials},
    },
  })

  for (const partial of partials) {
    const html = ejs.render(partial.html, res.locals)
    res.locals.partial[partial.code] = html
  }

  const html = ejs.render(fixedPage.html, res.locals)
  res.send(html)
}

async function findNews (req) {
  const news = await model.news.findOne({
    where: {
      id: {[Op.eq]: req.params.newsId},
      isPublished: {[Op.eq]: true},
    },
    include: [{model: model.site, as: 'site'}],
  })

  return c.convertNews(news)
}

async function findNewsLinks (req) {
  return await model.newsLink.findAll({
    where: {
      newsId: {[Op.eq]: req.params.newsId},
    },
    order: [['order', 'asc'], ['id', 'asc']],
  })
}

async function findNewsImages (req) {
  return await model.newsImage.findAll({
    where: {
      newsId: {[Op.eq]: req.params.newsId},
    },
    order: [['order', 'asc'], ['id', 'asc']],
  })
}

async function news (req, res, next) {
  await renderFixedPage(req, res, next, {code: '/news/0/'})
}

async function admission (_, res, next) {
  res.locals.setting = await findSetting(['openSchoolIsAccepting'])
  next()
}

async function document (_, res, next) {
  res.locals.documentCategories = await findDocumentCategories('admission')
  next()
}

async function studentDocument (_, res, next) {
  res.locals.documentCategories = await findDocumentCategories('student')
  next()
}

async function findAdmissionDocumentCategories () {
  return await findDocumentCategories('admission')
}

async function findStudentDocumentCategories () {
  return await findDocumentCategories('student')
}

async function findDocumentCategories (siteCode) {
  const sql = `
    select
      documentCategory.id as documentCategoryId,
      documentCategory.title as documentCategoryTitle,
      documentCategory.isUncategorized as documentCategoryIsUncategorized,
      document.id as documentId,
      document.title as documentTitle,
      document.datePublish as documentDatePublish,
      document.dateUpdate as documentDateUpdate,
      document.description as documentDescription,
      document.location as documentLocation
    from wisdomDocument as document
    inner join wisdomDocumentCategoryDocument as documentCategoryDocument
      on documentCategoryDocument.documentId = document.id
    inner join wisdomDocumentCategory as documentCategory
      on documentCategory.id = documentCategoryDocument.documentCategoryId
    inner join wisdomSite as site
      on site.id = documentCategory.siteId
    where site.code = ? and document.isPublished = 1
    order by documentCategory.order asc,
      documentCategory.id asc,
      document.order asc,
      document.id asc
  `

  const rows = await model.sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: [siteCode],
  })

  const partitions = partitionBy((row) => row.documentCategoryId, rows)
  const documentCategories = partitions.map((rows) => ({
    id: rows[0].documentCategoryId,
    title: rows[0].documentCategoryTitle,
    isUncategorized: rows[0].documentCategoryIsUncategorized,
    documents: rows.map((row) => ({
      id: row.documentId,
      title: row.documentTitle,
      datePublish: row.documentDatePublish,
      datePublishText: c.convertDate(row.documentDatePublish),
      dateUpdate: row.documentDateUpdate,
      dateUpdateText: c.convertDate(row.documentDateUpdate),
      location: row.documentLocation,
      description: row.documentDescription,
      descriptionLines: c.splitText(row.documentDescription),
      locationUrl: c.convertLocation(row.documentLocation),
    }))
  }))

  return documentCategories
}

async function findAdmissionFaqCategories (_, res, next) {
  return await findFaqCategories('admission')
}

async function findStudentFaqCategories (_, res, next) {
  return await findFaqCategories('student')
}

async function findFaqCategories (siteCode) {
  const rows = await findFaqRows(siteCode)
  const partitions = partitionBy((row) => row.faqCategoryId, rows)
  const faqCategories = partitions.map((rows) => ({
    title: rows[0].faqCategoryTitle,
    faqs: rows.map((row) => ({
      id: row.faqId,
      question: row.faqQuestion,
      questionLines: c.splitText(row.faqQuestion),
      answer: row.faqAnswer,
      answerLines: c.splitText(row.faqAnswer),
      faqLinks: [],
      faqImages: [],
    }))
  }))

  const faqIds = faqCategories.map(({faqs}) => {
    return faqs.map(({id}) => id)
  })
    .reduce((memo, ids) => memo.concat(ids), [])

  const faqLinks = await findFaqLinks(faqIds)
  const faqImages = await findFaqImages(faqIds)

  for (const faqCategory of faqCategories) {
    for (const faq of faqCategory.faqs) {
      if (faqLinks[faq.id]) {
        faq.faqLinks = faqLinks[faq.id]
      }

      if (faqImages[faq.id]) {
        faq.faqImages = faqImages[faq.id]
      }
    }
  }

  return faqCategories
}

async function findFaqRows (siteCode) {
  const sql = `
    select
      faqCategory.id as faqCategoryId,
      faqCategory.title as faqCategoryTitle,
      faq.id as faqId,
      faq.question as faqQuestion,
      faq.answer as faqAnswer
    from wisdomFaq as faq
    inner join wisdomFaqCategoryFaq as faqCategoryFaq
      on faqCategoryFaq.faqId = faq.id
    inner join wisdomFaqCategory as faqCategory
      on faqCategory.id = faqCategoryFaq.faqCategoryId
    inner join wisdomSite as site
      on site.id = faqCategory.siteId
    where site.code = ? and faq.isPublished = 1
    order by faqCategory.order asc,
      faqCategory.id asc,
      faq.order asc,
      faq.id asc
  `

  return await model.sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: [siteCode],
  })
}

async function findFaqLinks (faqIds) {
  return partitionBy(({faqId}) => faqId,
    await model.faqLink.findAll({
      where: {
        faqId: {[Op.in]: faqIds},
      },
      order: [['faqId', 'asc'], ['order', 'asc'], ['id', 'asc']],
    }))
    .reduce((memo, faqLinks) => {
      const [first] = faqLinks
      memo[first.faqId] = faqLinks
      return memo
    }, {})
}

async function findFaqImages (faqIds) {
  return partitionBy(({faqId}) => faqId,
    await model.faqImage.findAll({
      where: {
        faqId: {[Op.in]: faqIds},
      },
      order: [['faqId', 'asc'], ['order', 'asc'], ['id', 'asc']],
    }))
    .reduce((memo, faqImages) => {
      const [first] = faqImages
      memo[first.faqId] = faqImages
      return memo
    }, {})
}

function partitionBy(fn, coll) {
  if (coll.length === 0) {
    return []
  } else {
    return partitionByRecurse(fn, coll.slice(1), [[coll[0]]])
      .map((partition) => partition.reverse())
      .reverse() 
  }
}

function partitionByRecurse(fn, coll, memo) {
  if (coll.length === 0) {
    return memo
  } else {
    if (fn(coll[0]) === fn(memo[0][0])) {
      memo[0].unshift(coll[0])
    } else {
      memo.unshift([coll[0]])
    }

    return partitionByRecurse(fn, coll.slice(1), memo)
  }
}

function isJson (text) {
  try {
    JSON.parse(text)
    return true
  } catch (_) {
    return false
  }
}

async function findNewses () {
  return await model.news.findAll({
    where: {
      isPublished: {[Op.eq]: true},
    },
    include: [{model: model.site, as: 'site'}],
    order: [['date', 'desc'], ['id', 'desc']],
  })
}

async function findSetting (codes) {
  const memo = {}

  if (!codes) {
    return memo
  }

  for (const code of codes) {
    const setting = await model.setting.findOne({
      where: {
        code: {[Op.eq]: code},
      },
    })

    if (!setting) {
      continue
    }

    if (isJson(setting.value)) {
      memo[setting.code] = JSON.parse(setting.value)
    } else {
      memo[setting.code] = setting.value
    }
  }

  return memo
}

async function apiContactInitialize (_, res) {
  const form = f.makeFormContact()
  const validation = v.makeValidationContact()
  const contactCategories = await model.contactCategory.findAll({
    attributes: ['id', 'title', 'template'],
    where: {
      isPublished: {[Op.eq]: true},
    },
  })

  if (process.env.NODE_ENV === 'development') {
    form.name = '英智 太郎'
    form.phone = '09012345678'
    form.email = 'eichi@example.com'
    form.zip = '1234567'
    form.address = '新潟県長岡市宮栄3-16-14'
    form.contactCategoryId = contactCategories[0].id + ''
    form.text = '\nここにお問合せの内容が入ります。'.repeat(3).slice(1)
  }

  res.send({form, validation, contactCategories})
}

async function apiContactValidate (req, res) {
  res.send({validation: await v.validateContact(req)})
}

async function apiContactSubmit (req, res) {
  const {ok} = await v.validateContact(req)

  await model.sequelize.transaction(async (transaction) => {
    const contactCategory = await model.contactCategory.findOne({
      where: {
        id: {[Op.eq]: req.body.form.contactCategoryId},
      },
      transaction,
    })

    const contactHistory = await model.contactHistory.create({
      number: await generateContactHistoryNumber(transaction, 10),
      postedAt: new Date(),
      name: req.body.form.name,
      phone: req.body.form.phone,
      email: req.body.form.email,
      zip: req.body.form.zip,
      address: req.body.form.address,
      category: contactCategory.title,
      text: req.body.form.text,
    }, {transaction})

    const search = '?' + new URLSearchParams({
      number: contactHistory.number,
    }).toString()

    res.send({ok: true, redirect: '/contact/finish/' + search})
  })
}

async function generateContactHistoryNumber (transaction, retry) {
  if (retry <= 0) {
    throw new Error('retry <= 0')
  }

  const number = new Array(3).fill(1).map(_ => {
    return crypto.randomInt(10000).toString().padStart(4, '0')
  }).join('-')

  const contactHistory = await model.contactHistory.findOne({
    where: {
      number: {[Op.eq]: number},
    },
    transaction,
  })

  if (!contactHistory) {
    return number
  } else {
    return await generateContactHistoryNumber(transaction, retry - 1)
  }
}

function onNotFound (req, res, next) {
  res.status(404)
  renderFixedPage(req, res, next, {code: '/404/'})
}

function onError (err, _, res, __) {
  res.status(err.status || 500).end()
  winston.loggers.get('error').error(err.message)

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }
}
