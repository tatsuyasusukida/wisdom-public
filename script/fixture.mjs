import winston from 'winston'
import model from '../model/index.mjs'
import {makeLogger} from '../util/logging.mjs'

const IMAGE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg'

main()

async function main () {
  try {
    winston.loggers.add('query', makeLogger('debug', 'raw', 'fixture.log'))

    await model.sequelize.sync({force: true})

    const sites = [
      await model.site.create({
        order: 1,
        code: 'admission',
        title: '入学希望者向け',
      }),
      await model.site.create({
        order: 2,
        code: 'student',
        title: '在校生・卒業生向け',
      }),
    ]

    await insertRecordsNews(sites)
    await insertRecordsDocument(sites)
    await insertRecordsFaq(sites)
    await insertRecordsPage(sites)
    await insertRecordsContact()
    await insertRecordsEmail()
    await insertRecordsAdmin()
    await insertRecordsFile()
    await insertRecordsSource()
    await insertRecordsSetting()
  } catch (err) {
    console.error(err)
  } finally {
    await model.sequelize.close()
  }
}

async function insertRecordsNews (sites) {
  for (const site of sites) {
    for (let i = 1; i <= 10; i += 1) {
      const news = await model.news.create({
        date: '2022-04-' + i.toString().padStart(2, '0'),
        title: 'ここに新着情報のタイトルが入ります' + i,
        text: new Array(5).fill('ここに本文が入ります。').join('\n'),
        isPublished: i % 2 === 0,
        siteId: site.id,
      })

      for (let j = 1; j <= 3; j += 1) {
        await model.newsLink.create({
          order: j,
          title: 'ここに関連リンクのタイトルが入ります' + j,
          url: 'https://example.com/',
          newsId: news.id,
        })
      }

      for (let j = 1; j <= 3; j += 1) {
        await model.newsImage.create({
          order: j,
          title: 'ここに関連画像のタイトルが入ります' + j,
          alt: new Array(3).fill('ここに代替テキストが入ります。').join('\n'),
          filename: `image-${i}-${j}.jpg`,
          original: IMAGE,
          thumbnail: IMAGE,
          newsId: news.id,
        })
      }
    }
  }
}

async function insertRecordsDocument (sites) {
  const [siteAdmission, siteStudent] = sites
  const documentCategories = [
    await model.documentCategory.create({
      order: 1,
      title: '入試情報',
      isUncategorized: false,
      siteId: siteAdmission.id,
    }),
    await model.documentCategory.create({
      order: 2,
      title: '写真',
      isUncategorized: false,
      siteId: siteAdmission.id,
    }),
    await model.documentCategory.create({
      order: 3,
      title: '高校生活',
      isUncategorized: false,
      siteId: siteAdmission.id,
    }),
    await model.documentCategory.create({
      order: 4,
      title: 'データ',
      isUncategorized: false,
      siteId: siteAdmission.id,
    }),

    await model.documentCategory.create({
      order: 1,
      title: '未分類',
      isUncategorized: true,
      siteId: siteStudent.id,
    }),
  ]

  for (const documentCategory of documentCategories) {
    for (let i = 1; i <= 3; i += 1) {
      const document = await model.document.create({
        order: i,
        datePublish: '2021-04-0' + i,
        dateUpdate: '2021-04-0' + i,
        title: 'ここにダウンロード資料のタイトルが入ります' + i,
        description: new Array(3).fill('ここに説明が入ります。').join('\n'),
        filename: `document${i}.pdf`,
        location: process.env.BASE_URL + `/static/pdf/document${i}.pdf`,
        isPublished: i <= 2,
        siteId: documentCategory.siteId,
      })

      await model.documentCategoryDocument.create({
        documentCategoryId: documentCategory.id,
        documentId: document.id,
      })
    }
  }
}

async function insertRecordsFaq (sites) {
  for (const site of sites) {
    for (let i = 1; i <= 3; i += 1) {
      const faqCategory = await model.faqCategory.create({
        order: i,
        title: 'カテゴリ' + i,
        siteId: site.id,
      })

      for (let j = 1; j <= 3; j += 1) {
        const faq = await model.faq.create({
          order: j,
          question: 'ここに質問が入ります' + j,
          answer: new Array(5).fill('ここに回答が入ります。').join('\n'),
          isPublished: j <= 2,
          siteId: site.id,
        })

        await model.faqCategoryFaq.create({
          faqCategoryId: faqCategory.id,
          faqId: faq.id,
        })

        for (let k = 1; k <= 3; k += 1) {
          await model.faqLink.create({
            order: k,
            title: 'ここに関連リンクのタイトルが入ります' + k,
            url: 'https://example.com/',
            faqId: faq.id,
          })
        }

        for (let k = 1; k <= 3; k += 1) {
          await model.faqImage.create({
            order: k,
            title: 'ここに関連画像のタイトルが入ります' + k,
            alt: new Array(3).fill('ここに代替テキストが入ります。').join('\n'),
            filename: `image-${i}-${j}-${k}.jpg`,
            original: IMAGE,
            thumbnail: IMAGE,
            faqId: faq.id,
          })
        }
      }
    }
  }
}

async function insertRecordsPage (sites) {
  for (const site of sites) {
    await model.partial.create({
      order: 1,
      title: 'ヘッダー',
      code: site.code + '-header',
      html: [
        `<html>`,
      ].join('\n'),
      siteId: site.id,
    })

    await model.partial.create({
      order: 2,
      title: 'フッター',
      code: site.code + '-footer',
      html: [
        `</html>`,
      ].join('\n'),
      siteId: site.id,
    })

    for (let i = 1; i <= 3; i += 1) {
      await model.fixedPage.create({
        order: i,
        title: 'ここに固定ページのタイトルが入ります',
        code: site.code + '-page-' + i,
        html: [
          `----------`,
          `partials: ['${site.code}-header', '${site.code}-footer']`,
          `----------`,
          `<h1>ここにタイトルが入ります</h1>`,
          `<p>ここに本文が入ります。</p>`,
        ].join('\n'),
        isPublished: i % 2 === 0,
        siteId: site.id,
      })
    }
  }
}

async function insertRecordsContact () {
  for (let i = 1; i <= 3; i += 1) {
    await model.contactCategory.create({
      order: i,
      title: 'カテゴリ' + i,
      template: [
        `ここにカテゴリ${i}の例文が入ります。`,
        `ここにカテゴリ${i}の例文が入ります。`,
        `ここにカテゴリ${i}の例文が入ります。`,
      ].join('\n'),
      isPublished: i <= 2,
    })

    await model.contactHistory.create({
      number: `0000-0000-000${i}`,
      postedAt: '2022-04-01',
      name: '英智 太郎',
      phone: '09012345678',
      email: 'eichi@example.com',
      zip: '9401154',
      address: '新潟県⻑岡市宮栄3丁目16番14号',
      category: 'カテゴリ1',
      text: [
        'ここに本文が入ります。',
        'ここに本文が入ります。',
        'ここに本文が入ります。',
      ].join('\n'),
    })
  }
}

async function insertRecordsEmail () {
  for (let i = 1; i <= 3; i += 1) {
    await model.emailTemplate.create({
      code: 'email-template-' + i,
      order: i,
      title: 'ここにメールひな型のタイトルが入ります' + i,
      fromName: '長岡英智高等学校',
      fromEmail: 'eichi@example.com',
      toName: '{{contactHistory.name}} 様',
      toEmail: '{{contactHistory.email}} 様',
      bccEmail: 'eichi@example.com,eichi@example.com',
      subject: 'ここに件名が入ります',
      content: [
        'ここに本文が入ります。',
        'ここに本文が入ります。',
        'ここに本文が入ります。',
      ].join('\n'),
    })

    await model.emailHistory.create({
      sentAt: '2022-04-01',
      fromName: '長岡英智高等学校',
      fromEmail: 'eichi@example.com',
      toName: '英智 太郎 様',
      toEmail: 'eichi@example.com',
      bccEmail: 'eichi@example.com,eichi@example.com',
      subject: 'ここに件名が入ります',
      content: [
        'ここに本文が入ります。',
        'ここに本文が入ります。',
        'ここに本文が入ります。',
      ].join('\n'),
      isSent: true,
      errorCount: 0,
      errorMessage: 'ここにエラーメッセージが入ります。',
      errorStack: [
        'ここにスタックトレースが入ります。',
        'ここにスタックトレースが入ります。',
        'ここにスタックトレースが入ります。',
      ].join('\n'),
    })
  }
}

async function insertRecordsAdmin () {
  if (process.env.FIXTURE_ADMIN === '1') {
    await model.admin.create({
      email: process.env.FIXTURE_ADMIN_EMAIL,
    })
  }
}

async function insertRecordsFile () {
  for (let i = 1; i <= 3; i += 1) {
    await model.file.create({
      date: '2021-04-0' + i,
      title: 'ここにファイルのタイトルが入ります' + i,
      filename: `file-0${i}.jpg`,
      location: IMAGE,
      isPublished: i <= 2,
    })
  }
}

async function insertRecordsSource () {
  for (let i = 1; i <= 3; i += 1) {
    await model.source.create({
      order: i,
      title: 'ここにソースコードのタイトルが入ります' + i,
      filename: `source-0${i}.css`,
      text: [
        'ここに内容が入ります。',
        'ここに内容が入ります。',
        'ここに内容が入ります。',
      ].join('\n'),
      isPublished: i <= 2,
    })
  }
}

async function insertRecordsSetting () {
  let i = 0

  await model.setting.create({
    order: i += 1,
    title: 'オープンスクール申し込み受付中（受付中→1）',
    code: `openSchoolIsAccepting`,
    value: JSON.stringify(1, null, 2),
  })

  await model.setting.create({
    order: i += 1,
    title: 'レイアウト',
    code: `layout`,
    value: JSON.stringify({
      headerNav: {
        admission: {
          items: [
            {text: '学校紹介', href: '/about/'},
            {text: 'コース紹介', href: '/courses/'},
            {text: '入試情報', href: '/admission/'},
            {text: 'ダウンロード資料', href: '/document/'},
            {text: 'よくある質問', href: '/faq/'},
            {text: 'お問い合わせ', href: '/contact/'},
          ],
        },
        student: {
          items: [
            {text: '様式ダウンロード', href: '/student/document/'},
            {text: 'よくある質問', href: '/student/faq/'},
            {text: 'お問い合わせ', href: '/contact/'},
          ],
        },
      },
    }, null, 2),
  })
}
