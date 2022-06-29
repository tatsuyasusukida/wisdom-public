import path from 'path'
import express from 'express'
import morgan from 'morgan'
import basicAuth from 'basic-auth-connect'
import nocache from 'nocache'
import helmet from 'helmet'
import {makeLogger} from './util/logging.mjs'
import winston from 'winston'

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
          "img-src": ["'self'", "data:", "https://storage.googleapis.com"],
          "object-src": ["'none'"],
          "script-src": ["'self'", process.env.STATIC_URL],
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

    router.use((req, res, next) => {
      req.locals = {}
      res.locals.env = process.env
      res.locals.url = new URL(req.originalUrl, process.env.BASE_URL)

      res.locals.headerLinks = [
        {text: '学校紹介', href: '/about/'},
        {text: 'コース紹介', href: '/course/'},
        {text: '入試情報', href: '/admission/'},
        {text: 'ダウンロード資料', href: '/document/'},
        {text: 'よくある質問', href: '/faq/'},
        {text: 'お問い合わせ', href: '/contact/'},
      ]

      next()
    })

    router.use('/static/', express.static(new URL('static', import.meta.url).pathname))
    router.use('/static/', express.static(new URL('node_modules/bootstrap/dist', import.meta.url).pathname))

    router.get('/', wrap(home))
    router.get('/', (_, res) => res.render('home'))
    router.get('/about/', (_, res) => res.render('about'))

    router.use('/api/v1/', express.json())
    router.use('/api/v1/', nocache())

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

function home (req, res, next) {
  res.locals.newses = new Array(5).fill(1).map(_ => ({
    dateText: '2022.07.01',
    title: '新着情報のタイトルが入ります',
    href: '/news/1/',
  }))

  next()
}

function onNotFound (_, res) {
  res.status(404).end()
}

function onError (err, _, res, __) {
  res.status(err.status || 500).end()
  winston.loggers.get('error').error(err.message)

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }
}
