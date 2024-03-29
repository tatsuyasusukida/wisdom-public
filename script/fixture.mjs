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

    await insertRecordsNews(sites)
    await insertRecordsDocument(sites)
    await insertRecordsFaq(sites)
    await insertRecordsPage(sites)
    await insertRecordsContact()
    await insertRecordsEmail()
    await insertRecordsAdmin()
    await insertRecordsSource()
    await insertRecordsSetting()
  } catch (err) {
    console.error(err)
  } finally {
    await model.sequelize.close()
  }
}

async function insertRecordsNews (sites) {
  const site = sites.find((site) => site.code === 'admission')

  const news = await model.news.create({
    date: '2022-08-01',
    title: 'ここに新着情報のタイトルが入ります',
    text: new Array(5).fill('ここに本文が入ります。').join('\n'),
    isPublished: true,
    siteId: site.id,
  })
}

async function insertRecordsDocument (sites) {
  await insertRecordsDocumentAdmission(sites)
  await insertRecordsDocumentStudent(sites)
}

async function insertRecordsDocumentAdmission (sites) {
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
        filename: 'pamphlet.pdf',
        location: process.env.STATIC_URL + '/pdf/pamphlet.pdf',
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
        location: process.env.STATIC_URL + '/pdf/photo-uniform.pdf',
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
        location: process.env.STATIC_URL + '/pdf/photo-miyauchi.pdf',
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
        location: process.env.STATIC_URL + '/pdf/photo-ekimae.pdf',
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
        location: process.env.STATIC_URL + '/pdf/photo-ekihigashi.pdf',
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
        location: process.env.STATIC_URL + '/pdf/photo-sanjo.pdf',
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
        filename: 'event-schedule.pdf',
        location: process.env.STATIC_URL + '/pdf/event-schedule.pdf',
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
      title: 'データ',
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
        filename: 'junior-high-school.pdf',
        location: process.env.STATIC_URL + '/pdf/junior-high-school.pdf',
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

async function insertRecordsDocumentStudent (sites) {
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
      filename: `format-01.pdf`,
      location: process.env.STATIC_URL + `/pdf/format-01.pdf`,
      isPublished: true,
      siteId: siteStudent.id,
    }),

    await model.document.create({
      order: 2,
      datePublish: '2022-08-01',
      dateUpdate: '2022-08-01',
      title: '学校感染症と出席停止期間の基準',
      description: '',
      filename: `format-02.pdf`,
      location: process.env.STATIC_URL + `/pdf/format-02.pdf`,
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
      filename: `format-01.pdf`,
      location: process.env.STATIC_URL + `/pdf/format-03.pdf`,
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

async function insertRecordsFaq (sites) {
  await insertRecordsFaqAdmission(sites)
  await insertRecordsFaqStudent(sites)
}

async function insertRecordsFaqAdmission (sites) {
  const siteAdmission = sites.find((site) => site.code === 'admission')

  {
    const faqCategory = await model.faqCategory.create({
      order: 1,
      title: '入試／入学',
      siteId: siteAdmission.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: '中学校からの新卒者枠はありますか？　新卒者枠が埋まった場合、二次募集はありますか？',
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
          '心配な生徒は事前に中学校の先生を通してご相談ください。可能な範囲で対応いたします。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '選考検査の作文の提出方法について教えてください。',
        answer: [
          '募集要項に従って指定の原稿用紙にボールペンまたは鉛筆で事前に記入し、提出をしてください。詳しい提出方法に関しては、募集要項をご覧ください。',
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
      title: '教育内容',
      siteId: siteAdmission.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: '在学中のコース変更はできますか？',
        answer: [
          '可能です。通学コースから通信教育コースは毎月１日に、通信教育コースから通学コースへは４月のみコース異動が可能です。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '特別支援学級や適応指導教室などに通っていた生徒はいますか？',
        answer: [
          '在籍している生徒の中には、特別支援学級や適応指導教室などに通う経験を持つ生徒もいます。通信制高校の多様な学び方を通して、様々な経験を積んで進学や就職などそれぞれの道へ進んでいく生徒が大勢います。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '何年で卒業できますか？',
        answer: [
          '最短で3年間で卒業することが可能です（各コース共通）。',
          '転学生は、前籍校と合わせて高校通算３年間で卒業することが可能です。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '年度途中で退学する生徒はいますか？',
        answer: [
          '通学コース・通信教育コースの２つのコースによって、自分にあったコースを選び入学することができます。コース変更などで居場所を変更したりしながら卒業を目指すことができるため、退学する生徒は少ないです。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '不登校などの理由で、勉強についていけるかが不安です',
        answer: [
          '通学コースでは、学校独自科目「ベーシックスキル」によって小中学校の学び直しの時間を設けています。振り返り学習を行うことで、基礎学力を定着させ、勉強に対する不安を取り除いていきます。また、通信教育コースではタブレットを使用しながら、自分のペースで学習を進めていきますので、個人にあった科目の履修を行います。勉強に対する不安は誰しもが持っていると思いますが、その悩みに当校に教職員が寄り添います。',
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
      title: '高校生活',
      siteId: siteAdmission.id,
    })

    let i = 0

    const faqs = [
      await model.faq.create({
        order: i += 1,
        question: 'キャリア教育の内容について教えてください。',
        answer: [
          '各学年でテーマに合わせた進路指導を行います。進路ガイダンスや面接練習などそれぞれのステップに合わせてより実践的な指導を行っていきます。また令和４年度より専門学校と連携した体験授業もスタートしました。３年間を通した進路指導を実践していきます。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '生徒から人気のある学校行事は何ですか？',
        answer: [
          '通学コースでは体育祭や修学旅行が人気です。年間を通して様々な行事が実施されています。また、通信教育コースでは独自の内容で特別活動を実施しています。様々な内容から選択して自分の好きな活動に参加することができます。',
        ].join('\n'),
        isPublished: true,
        siteId: siteAdmission.id,
      }),

      await model.faq.create({
        order: i += 1,
        question: '盛んな部活動は何ですか？部活動は必ず入部しなくてはいけませんか？',
        answer: [
          '現在、６つの運動部と１つの運動部があります。全日制高校のように毎日活動するわけではありませんが、大会前などに集まって活動を行っています。入部は自由で初心者でも大歓迎です。ぜひ長岡英智高校の部活を盛り上げてください。',
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

async function insertRecordsFaqStudent (sites) {
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

async function insertRecordsPage (sites) {
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
      title: '長岡英智高等学校｜通学できる通信制高校',
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
      title: '新着情報｜長岡英智高等学校',
      partials: ['admissionHeader', 'admissionFooter'],
      settings: [],
      locals: [
        {name: 'news', function: 'findNews', required: true},
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
      title: '学校紹介｜長岡英智高等学校',
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
      title: 'コース紹介｜長岡英智高等学校',
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
      title: '通学コース｜長岡英智高等学校',
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
      title: '通信教育コース｜長岡英智高等学校',
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
      title: '入試情報｜長岡英智高等学校',
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
      title: 'ダウンロード資料｜長岡英智高等学校',
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
      title: 'よくある質問｜長岡英智高等学校',
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
      title: 'お問い合わせ｜長岡英智高等学校',
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
      title: 'お問い合わせ完了｜長岡英智高等学校',
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
      title: '採用情報｜長岡英智高等学校',
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
      title: 'プライバシーポリシー｜長岡英智高等学校',
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
    title: '404 Not Found',
    code: '/404/',
    frontmatter: JSON.stringify({
      title: 'お探しのページは見つかりませんでした｜長岡英智高等学校',
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
      title: '在校生・卒業生向けページ｜長岡英智高等学校',
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
      title: '様式ダウンロード｜長岡英智高等学校',
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
    title: 'よくある質問',
    code: '/student/faq/',
    frontmatter: JSON.stringify({
      title: '在校生・卒業生向けよくある質問｜長岡英智高等学校',
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

async function insertRecordsContact () {
  await model.contactCategory.create({
    order: 1,
    title: '資料のお取り寄せ',
    template: [
      `下記の通り資料を請求いたします。`,
      ``,
      `パンフレット：●部`,
      `生徒募集要項：●部`,
      `転入学生徒募集要項：●部`,
    ].join('\n'),
    isPublished: true,
  })

  await model.contactCategory.create({
    order: 2,
    title: '見学・相談の申し込み',
    template: [
      `下記の通り見学・相談を申し込みます。`,
      ``,
      `▼日時（9：00～17：00 土日祝を除く）`,
      `第1希望：●月●日●時から●時まで`,
      `第2希望：●月●日●時から●時まで`,
      `第3希望：●月●日●時から●時まで`,
      ``,
      `▼場所（見学の場合）`,
      `見学希望：宮内本校／長岡駅前校／長岡駅東校／三条校`,
      ``,
      `▼参加者`,
      `氏名：●● ●●`,
      `氏名：●● ●● `,
      ``,
      `▼備考`,
      ``,
    ].join('\n'),
    isPublished: true,
  })

  await model.contactCategory.create({
    order: 3,
    title: 'その他',
    template: [
      '',
    ].join('\n'),
    isPublished: true,
  })
}

async function insertRecordsEmail () {
  await model.emailTemplate.create({
    code: 'contact',
    order: 1,
    title: 'お問い合わせの受け付けメール',
    fromName: '長岡英智高等学校',
    fromEmail: 'eichi@loremipsum.co.jp',
    toName: '<%= contactHistory.name %> 様',
    toEmail: '<%= contactHistory.email %>',
    bccEmail: 'susukida@rabbitpro.co.jp',
    subject: 'お問い合わせを受け付けました｜長岡英智高等学校',
    content: [
      '<%= contactHistory.name %> 様',
      '',
      'この度は長岡英智高等学校のホームページより、',
      'お問い合わせをいただきましてありがとうございます。',
      '',
      '下記の通りお問い合わせを受け付けましたのでお知らせいたします。',
      'なお、電話番号と住所については大切な個人情報を保護するために記載を控えております。',
      '',
      'お名前：<%= contactHistory.name %> 様',
      'メールアドレス：<%= contactHistory.email %>',
      '郵便番号：<%= contactHistory.zip %>',
      'お問い合わせの種類：<%= contactHistory.category %>',
      '',
      '<%= contactHistory.text %>',
      '',
      'お問い合わせ内容を確認の上、改めてご連絡いたします。',
      '万が一、本校からのご連絡がない場合はお手数をおかけして誠に恐縮ですが、',
      'お電話またはメールにてお問い合わせください。',
      'その際、下記のお問い合わせ番号をお伝えください。',
      '',
      '電話番号',
      '0258-31-6771',
      '',
      'メールアドレス',
      'will@eichi.ed.jp',
      '',
      'お問い合わせ番号',
      '<%= contactHistory.number %>',
      '',
      '＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊　　　　　　　　　　　　',
      '〈校　訓〉立ち止まる・考える・行動する',
      '',
      '学校法人英智学院　長岡英智高等学校',
      '',
      '長岡市宮栄３－１６－１４',
      'Tel:0258-31-6771　Fax:0258-31-6772',
      'will@eichi.ed.jp',
    ].join('\n'),
  })
}

async function insertRecordsAdmin () {
  if (process.env.FIXTURE_ADMIN === '1') {
    await model.admin.create({
      email: process.env.FIXTURE_ADMIN_EMAIL,
    })
  }
}

async function insertRecordsSource () {
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
    value: JSON.stringify(0, null, 2),
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
