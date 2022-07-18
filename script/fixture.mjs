import path from 'path'
import fsPromises from 'fs/promises'
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

    await insertRecordsNewsProduction(sites)
    await insertRecordsDocumentProduction(sites)
    await insertRecordsFaqProduction(sites)
    await insertRecordsPageProduction(sites)
    await insertRecordsContact()
    await insertRecordsEmail()
    await insertRecordsAdmin()
    await insertRecordsFile()
    await insertRecordsSourceProduction()
    await insertRecordsSetting()
  } catch (err) {
    console.error(err)
  } finally {
    await model.sequelize.close()
  }
}

async function insertRecordsNewsProduction (sites) {
  const site = sites.find((site) => site.code === 'admission')

  const news = await model.news.create({
    date: '2022-08-01',
    title: 'ここに新着情報のタイトルが入ります',
    text: new Array(5).fill('ここに本文が入ります。').join('\n'),
    isPublished: true,
    siteId: site.id,
  })
}

async function insertRecordsNewsDevelopment (sites) {
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

async function insertRecordsDocumentProduction (sites) {
  await insertRecordsDocumentProductionAdmission(sites)
  await insertRecordsDocumentProductionStudent(sites)
}

async function insertRecordsDocumentProductionAdmission (sites) {
  const siteAdmission = sites.find((site) => site.code === 'admission')

  {
    const documentCategory = await model.documentCategory.create({
      order: 1,
      title: '入試情報',
      isUncategorized: false,
      siteId: siteAdmission.id,
    })

    const documents = [
      await model.document.create({
        order: 1,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '令和4年度 パンフレット',
        description: '',
        filename: 'category-01-document-01.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-01-document-01.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const document of documents) {
      await model.documentCategoryDocument.create({
        documentCategoryId: documentCategory.id,
        documentId: document.id,
      })
    }
  }

  {
    const documentCategory = await model.documentCategory.create({
      order: 2,
      title: '写真',
      isUncategorized: false,
      siteId: siteAdmission.id,
    })

    const documents = [
      await model.document.create({
        order: 1,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '制服の写真',
        description: '',
        filename: 'category-02-document-01.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-02-document-01.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
      await model.document.create({
        order: 2,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '宮内本校の写真',
        description: '',
        filename: 'category-02-document-02.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-02-document-02.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
      await model.document.create({
        order: 3,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '長岡駅前校の写真',
        description: '',
        filename: 'category-02-document-03.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-02-document-03.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
      await model.document.create({
        order: 4,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '長岡駅東校の写真',
        description: '',
        filename: 'category-02-document-04.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-02-document-04.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
      await model.document.create({
        order: 5,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '三条校の写真',
        description: '',
        filename: 'category-02-document-05.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-02-document-05.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const document of documents) {
      await model.documentCategoryDocument.create({
        documentCategoryId: documentCategory.id,
        documentId: document.id,
      })
    }
  }

  {
    const documentCategory = await model.documentCategory.create({
      order: 3,
      title: '高校生活',
      isUncategorized: false,
      siteId: siteAdmission.id,
    })

    const documents = [
      await model.document.create({
        order: 1,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '年間行事／部活動',
        description: '',
        filename: 'category-03-document-01.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-03-document-01.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const document of documents) {
      await model.documentCategoryDocument.create({
        documentCategoryId: documentCategory.id,
        documentId: document.id,
      })
    }
  }

  {
    const documentCategory = await model.documentCategory.create({
      order: 4,
      title: '写真',
      isUncategorized: false,
      siteId: siteAdmission.id,
    })

    const documents = [
      await model.document.create({
        order: 1,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '生徒状況（在校生出身中学校）',
        description: '',
        filename: 'category-04-document-01.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-04-document-01.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
      await model.document.create({
        order: 2,
        datePublish: '2022-08-01',
        dateUpdate: '2022-08-01',
        title: '進路状況調査結果（卒業生の進路先）',
        description: '',
        filename: 'category-04-document-02.pdf',
        location: process.env.STATIC_URL + '/pdf/document/category-04-document-02.pdf',
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const document of documents) {
      await model.documentCategoryDocument.create({
        documentCategoryId: documentCategory.id,
        documentId: document.id,
      })
    }
  }
}

async function insertRecordsDocumentProductionStudent (sites) {
  const siteStudent = sites.find((site) => site.code === 'student')
  const documentCategory = await model.documentCategory.create({
    order: 1,
    title: '未分類',
    isUncategorized: true,
    siteId: siteStudent.id,
  })

  const documents = [
    await model.document.create({
      order: 1,
      datePublish: '2022-08-01',
      dateUpdate: '2022-08-01',
      title: '証明書(学校感染症)',
      description: [
        [
          '医師から、「学校感染症の分類」PDFに記載のある感染症と診断された場合、学校までご連絡ください。',
          '学校保健安全法の規定により、学校感染症に感染している、またはその疑いがある場合、生徒は出席停止となります。',
          '医師の判断に基づき、登校許可が出るまでは学校を休んで十分に休養をしてください。',
          '出席停止期間は欠席にはなりません。',
          'なお、登校する際は「証明書」PDFをダウンロードし、医師からの記入後、速やかに担任までご提出ください。',
          '「証明書」は本校で直接配布するか郵送、またはHPからダウンロードできます。',
        ].join(''),
        '',
        '※ 必要な書類は、下のPDF版をダウンロードしてください。',
        '※ 感染が分かった時点で、速やかに学校までご連絡ください。',
        '※ 詳細をお知りになりたい場合は、養護教諭までお問い合わせください。',
      ].join('\n'),
      filename: `document-01.pdf`,
      location: process.env.STATIC_URL + `/pdf/document-01.pdf`,
      isPublished: true,
      siteId: siteStudent.id,
    }),

    await model.document.create({
      order: 2,
      datePublish: '2022-08-01',
      dateUpdate: '2022-08-01',
      title: '学校感染症と出席停止期間の基準',
      description: '',
      filename: `document-02.pdf`,
      location: process.env.STATIC_URL + `/pdf/document-02.pdf`,
      isPublished: true,
      siteId: siteStudent.id,
    }),

    await model.document.create({
      order: 3,
      datePublish: '2022-08-01',
      dateUpdate: '2022-08-01',
      title: '証明書(学校感染症)',
      description: [
        '【請求できる証明書の種類】',
        '卒業証明書、成績証明書、単位修得証明書、調査書',
        '',
        '【発行料金】',
        '1通につき 300 円(在学生は無料)',
        '',
        '【請求方法】',
        '「学校に来校しての手続き」と「郵送による手続き」の2通りの方法があり、利用しやすい方で請求してください。',
      ].join('\n'),
      filename: `document-01.pdf`,
      location: process.env.STATIC_URL + `/pdf/document-03.pdf`,
      isPublished: true,
      siteId: siteStudent.id,
    })
  ]

  for (const document of documents) {
    await model.documentCategoryDocument.create({
      documentCategoryId: documentCategory.id,
      documentId: document.id,
    })
  }
}

async function insertRecordsDocumentDevelopment (sites) {
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

async function insertRecordsFaqProduction (sites) {
  await insertRecordsFaqProductionAdmission(sites)
  await insertRecordsFaqProductionStudent(sites)
}

async function insertRecordsFaqProductionAdmission (sites) {
  const siteAdmission = sites.find((site) => site.code === 'admission')

  {
    const faqCategory = await model.faqCategory.create({
      order: 1,
      title: '本校について',
      siteId: siteAdmission.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: '長岡英智高等学校の特色は何ですか？',
        answer: [
          '長岡英智高等学校の特色は、中学校の新卒者に加え、高校中退者や転校希望者へも開かれた高校として３年間で卒業に導くことに主眼を置き、生徒一人ひとりの状況に応じた指導を行います。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '公立高校との違いは何ですか？',
        answer: [
          '長岡英智高等学校は私立高校です。私立高校は、独自の建学の精神に基づいた教育を行っています。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const faq of faqs) {
      await model.faqCategoryFaq.create({
        faqCategoryId: faqCategory.id,
        faqId: faq.id,
      })
    }
  }

  {
    const faqCategory = await model.faqCategory.create({
      order: 2,
      title: '入試／入学',
      siteId: siteAdmission.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: '中学校からの新卒者枠はありますか？新卒者枠が埋まった場合、二次募集はなくなりますか？',
        answer: [
          '募集定員１６０名のうち１４０名が中学校からの新卒者枠です。欠員がある場合のみ二次募集を行います。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '学費の補助制度はありますか？',
        answer: [
          '保護者の所得に応じて、就学支援金が支給されます。また、一定の要件により、授業料及び施設設備費等の全額または一部を補助する新潟県学費軽減事業という制度もあります。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '選考検査の面接で特別な支援を必要とする生徒への配慮はできますか？',
        answer: [
          '状況を伺った上で可能な限り配慮させていただきます。心配な生徒は事前に入学相談にいらしてください。中学校の先生とも連携していきます。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '選考検査の作文は事前に書いていくのか、当日書くのかを教えて下さい。',
        answer: [
          '事前に書いて提出してもらいます。募集要項に指定の用紙があります。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const faq of faqs) {
      await model.faqCategoryFaq.create({
        faqCategoryId: faqCategory.id,
        faqId: faq.id,
      })
    }
  }

  {
    const faqCategory = await model.faqCategory.create({
      order: 3,
      title: '教育内容',
      siteId: siteAdmission.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: '通学コースと通信教育コースとの違いは何ですか？',
        answer: [
          '通学コースは、日々の授業の中でレポートを完成させていきますが、通信教育コースは、タブレット上でレポートを作成し提出します。通信教育コース生の中には各校舎に通ってレポート作成を行っている生徒も多くいます。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '在学中のコース変更はできますか？',
        answer: [
          '通学コース・通信教育コースの２つのコース間でコース変更が可能です。自分に合ったコースで卒業が目指せます。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '通学コースの今年度の生徒数は？その中で、特別支援学級や適応指導教室などに通っていた生徒はどのくらいいますか？',
        answer: [
          '通学コースには約１７０名在籍しています。在籍生徒の多くは、小・中学校時代に、適応指導教室や特別支援学級等に通っていました。不登校を経験した多くの生徒が元気に学校生活を送っています。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '何年で卒業できますか？',
        answer: [
          'どのコースも３年間で卒業が可能です。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '３年間で卒業できる仕組みは？',
        answer: [
          '本校は通信制課程ですので、レポート課題へ取り組むことで、全日制より少ない授業時数で単位の認定を行うからです。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '年度途中で退学する生徒はいますか？',
        answer: [
          '通学コース・通信教育コースの二つのコースより自分にあったコースを選び入学します。期間や時期はありますが、コース変更も可能ですので、退学を選択する生徒は少ないです。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '不登校などの理由で、学力が低く勉強についていけるか心配です。',
        answer: [
          '大丈夫です。どの授業も、生徒一人ひとりに寄り添ったきめ細かい授業を行っています。わからないところは遠慮なく質問してください。また、平成２８年度より「公文式学習」を導入し、基礎学力を身につけます。「やればできる！」が体感できるはずです。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const faq of faqs) {
      await model.faqCategoryFaq.create({
        faqCategoryId: faqCategory.id,
        faqId: faq.id,
      })
    }
  }

  {
    const faqCategory = await model.faqCategory.create({
      order: 4,
      title: '高校生活',
      siteId: siteAdmission.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: 'キャリア教育の内容について教えてください。',
        answer: [
          '「総合的な探究の時間」の時間や「特別活動」の中で、進路講話や進路ガイダンス、職場見学などを行っています。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '生徒から人気のある学校行事は何ですか？',
        answer: [
          '球技大会やスキー・スノーボード授業が人気です。特に修学旅行は大人気です。また、生徒生活体験発表大会や生徒会が中心となって体育祭や英好祭（文化祭）も開催しています。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '盛んな部活動は何ですか？部活動は必ず入部しなくてはいけませんか？',
        answer: [
          '軟式野球部、ソフトテニス部、バドミントン部、卓球部、陸上競技部が全国大会への出場を果たしています。全日制高校のように毎日活動するわけではありませんが、どの部活も日程を調整して活動しています。入部は自由です。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '携帯電話の持ち込みは可能ですか？',
        answer: [
          '携帯電話、スマートフォンの持ち込みは認めています。ただし、授業中、全校活動中などは使用禁止です。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: 'アルバイトは可能ですか？',
        answer: [
          '可能です。通学コースの生徒の場合のみ、アルバイト許可届けを提出してもらっています。ただし、高校生としてふさわしくないアルバイトは認めていません。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),
    ]

    for (const faq of faqs) {
      await model.faqCategoryFaq.create({
        faqCategoryId: faqCategory.id,
        faqId: faq.id,
      })
    }
  }
}

async function insertRecordsFaqProductionStudent (sites) {
  const siteStudent = sites.find((site) => site.code === 'student')

  {
    const faqCategory = await model.faqCategory.create({
      order: 1,
      title: '感染症について',
      siteId: siteStudent.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: '感染症と診断された場合はどうすれば良いですか？',
        answer: [
          '医師から「学校感染症の分類」に記載のある感染症と診断された場合、学校までご連絡ください。学校感染症の分類については下記の様式ダウンロードページからPDFをダウンロードすることができます。学校保健安全法の規定により、学校感染症に感染している、またはその疑いがある場合、生徒は出席停止となります。医師の判断に基づき、登校許可が出るまでは学校を休んで十分に休養をしてください。出席停止期間は欠席にはなりません。',
        ].join('\n'),
        isPublished: true,
        siteId: siteStudent.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '感染症から回復した後、登校する場合はどうすれば良いですか？',
        answer: [
          '登校する際は下記の様式ダウンロードページから「証明書」PDFをダウンロードし、医師からの記入後、速やかに担任までご提出ください。なお、証明書は本校で直接配布または郵送も可能です。',
        ].join('\n'),
        isPublished: true,
        siteId: siteStudent.id,
      }),
    ]

    await model.faqLink.create({
      order: 1,
      title: '様式ダウンロードページ',
      url: '/student/document/',
      faqId: faqs[faqs.length - 1].id,
    })

    for (const faq of faqs) {
      await model.faqCategoryFaq.create({
        faqCategoryId: faqCategory.id,
        faqId: faq.id,
      })
    }
  }

  {
    const faqCategory = await model.faqCategory.create({
      order: 2,
      title: '証明書の発行について',
      siteId: siteStudent.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: '卒業証明書を発行するにはどのような手続きをすればよいですか？',
        answer: [
          '証明書交付願に記入の上、来校または郵送にてお手続きください。証明書交付願については下記の様式ダウンロードページからPDFをダウンロードすることができます。',
        ].join('\n'),
        isPublished: true,
        siteId: siteStudent.id,
      }),
    ]

    await model.faqLink.create({
      order: 1,
      title: '様式ダウンロードページ',
      url: '/student/document/',
      faqId: faqs[faqs.length - 1].id,
    })

    for (const faq of faqs) {
      await model.faqCategoryFaq.create({
        faqCategoryId: faqCategory.id,
        faqId: faq.id,
      })
    }
  }
}

async function insertRecordsFaqDevelopment (sites) {
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

async function readView (view) {
  const {pathname} = new URL(import.meta.url)
  const dirname = path.dirname(pathname)
  const source = path.join(dirname, '../view/', view)

  return (await fsPromises.readFile(source)).toString()
}

async function readFile (file) {
  const {pathname} = new URL(import.meta.url)
  const dirname = path.dirname(pathname)
  const source = path.join(dirname, '..', file)

  return (await fsPromises.readFile(source)).toString()
}

async function insertRecordsPageProduction (sites) {
  const siteAdmission = sites.find((site) => site.code === 'admission')
  const siteStudent = sites.find((site) => site.code === 'student')

  await model.partial.create({
    order: 1,
    title: 'ヘッダー',
    code: 'admissionHeader',
    html: await readView('partial-header.ejs'),
    siteId: siteAdmission.id,
  })

  await model.partial.create({
    order: 2,
    title: 'フッター',
    code: 'admissionFooter',
    html: await readView('partial-footer.ejs'),
    siteId: siteAdmission.id,
  })

  let i = 0

  await model.fixedPage.create({
    order: i += 1,
    title: 'トップ',
    code: '/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: ['openSchoolIsAccepting'],
      locals: [
        {name: 'newses', function: 'findNewses'},
      ],
    }, null, 2),
    html: await readView('home.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '新着情報',
    code: '/news/0/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [
        {name: 'news', function: 'findNews'},
        {name: 'newsLinks', function: 'findNewsLinks'},
        {name: 'newsImages', function: 'findNewsImages'},
      ],
    }, null, 2),
    html: await readView('news.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '学校紹介',
    code: '/about/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('about.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: 'コース紹介',
    code: '/courses/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('courses.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '通学コース',
    code: '/courses/commute/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('courses-commute.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '通信教育コース',
    code: '/courses/correspondence/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('courses-correspondence.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '入試情報',
    code: '/admission/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: ['openSchoolIsAccepting'],
      locals: [],
    }, null, 2),
    html: await readView('admission.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: 'ダウンロード資料',
    code: '/document/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [
        {name: 'documentCategories', function: 'findAdmissionDocumentCategories'},
      ],
    }, null, 2),
    html: await readView('document.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: 'よくある質問',
    code: '/faq/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [
        {name: 'faqCategories', function: 'findAdmissionFaqCategories'},
      ],
    }, null, 2),
    html: await readView('faq.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: 'お問い合わせ',
    code: '/contact/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('contact.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: 'お問い合わせ完了',
    code: '/contact/finish/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('contact-finish.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '採用情報',
    code: '/recruit/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: ['recruitIsAccepting'],
      locals: [],
    }, null, 2),
    html: await readView('recruit.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: 'プライバシーポリシー',
    code: '/privacy/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('privacy.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: 'お探しのページは見つかりませんでした',
    code: '/404/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('404.ejs'),
    isPublished: true,
    siteId: siteAdmission.id,
  })

  i = 0

  await model.fixedPage.create({
    order: i += 1,
    title: '在校生・卒業生向けページ',
    code: '/student/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [],
    }, null, 2),
    html: await readView('student.ejs'),
    isPublished: true,
    siteId: siteStudent.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '様式ダウンロード',
    code: '/student/document/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [
        {name: 'documentCategories', function: 'findStudentDocumentCategories'},
      ],
    }, null, 2),
    html: await readView('student-document.ejs'),
    isPublished: true,
    siteId: siteStudent.id,
  })

  await model.fixedPage.create({
    order: i += 1,
    title: '在校生・卒業生向けよくある質問',
    code: '/student/faq/',
    frontmatter: JSON.stringify({
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [
        {name: 'faqCategories', function: 'findStudentFaqCategories'},
      ],
    }, null, 2),
    html: await readView('student-faq.ejs'),
    isPublished: true,
    siteId: siteStudent.id,
  })

}

async function insertRecordsPageDevelopment (sites) {
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
        frontmatter: '',
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

async function insertRecordsSourceProduction () {
  let i = 0

  await model.source.create({
    order: i += 1,
    title: 'bootstrap-reboot.min.css',
    filename: 'bootstrap-reboot.min.css',
    text: await readFile('static/css/bootstrap-reboot.min.css'),
    isPublished: true,
  })

  await model.source.create({
    order: i += 1,
    title: 'bootstrap-grid.min.css',
    filename: 'bootstrap-grid.min.css',
    text: await readFile('static/css/bootstrap-grid.min.css'),
    isPublished: true,
  })

  await model.source.create({
    order: i += 1,
    title: 'screen.css',
    filename: 'screen.css',
    text: await readFile('static/css/screen.css'),
    isPublished: true,
  })

  await model.source.create({
    order: i += 1,
    title: 'vue.js',
    filename: 'vue.js',
    text: await readFile('static/js/vue.js'),
    isPublished: true,
  })

  await model.source.create({
    order: i += 1,
    title: 'vue.min.js',
    filename: 'vue.min.js',
    text: await readFile('static/js/vue.min.js'),
    isPublished: true,
  })

  await model.source.create({
    order: i += 1,
    title: 'main.js',
    filename: 'main.js',
    text: await readFile('static/js/main.js'),
    isPublished: true,
  })
}

async function insertRecordsSourceDevelopment () {
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
    title: '教職員募集中（募集中→1）',
    code: `recruitIsAccepting`,
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
          ],
        },
      },
    }, null, 2),
  })

  await model.setting.create({
    order: i += 1,
    title: 'セキュリティ設定',
    code: `security`,
    value: JSON.stringify({
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
    }, null, 2),
  })
}
