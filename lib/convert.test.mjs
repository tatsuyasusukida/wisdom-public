import * as c from './convert.mjs'
import assert from 'assert'

describe('convert', () => {
  it('convertNews', () => {
    const news = {
      id: 'id',
      date: '2011-06-01',
      title: 'title',
      text: 'text\ntext\ntext',
      isPublished: true,
      site: {
        id: 'id',
      },
    }

    const actual = c.convertNews(news)
    const expected = {
      id: 'id',
      date: '2011-06-01',
      dateText: '2011.06.01',
      title: 'title',
      text: 'text\ntext\ntext',
      textLines: ['text', 'text', 'text'],
      isPublished: true,
      site: {
        id: 'id',
      },
    }

    assert.deepStrictEqual(actual, expected)
  })

  it('convertNewsImage', () => {
    const newsImage = {
      id: 'id',
      order: 'order',
      title: 'title',
      alt: 'alt\nalt\nalt',
      filename: 'filename',
      original: 'gs://bucket/original',
      thumbnail: 'gs://bucket/thumbnail',
    }

    const actual = c.convertNewsImage(newsImage)
    const expected = {
      id: 'id',
      order: 'order',
      title: 'title',
      alt: 'alt\nalt\nalt',
      filename: 'filename',
      original: 'gs://bucket/original',
      originalUrl: 'https://storage.googleapis.com/bucket/original',
      thumbnail: 'gs://bucket/thumbnail',
      thumbnailUrl: 'https://storage.googleapis.com/bucket/thumbnail',
    }

    assert.deepStrictEqual(actual, expected)
  })

  it('convertFaqImage', () => {
    const faqImage = {
      id: 'id',
      order: 'order',
      title: 'title',
      alt: 'alt\nalt\nalt',
      filename: 'filename',
      original: 'gs://bucket/original',
      thumbnail: 'gs://bucket/thumbnail',
    }

    const actual = c.convertFaqImage(faqImage)
    const expected = {
      id: 'id',
      order: 'order',
      title: 'title',
      alt: 'alt\nalt\nalt',
      filename: 'filename',
      original: 'gs://bucket/original',
      originalUrl: 'https://storage.googleapis.com/bucket/original',
      thumbnail: 'gs://bucket/thumbnail',
      thumbnailUrl: 'https://storage.googleapis.com/bucket/thumbnail',
    }

    assert.deepStrictEqual(actual, expected)
  })

  it('convertDateDot', () => {
    const date = '2011-06-01'
    const actual = c.convertDateDot(date)
    const expected = '2011.06.01'

    assert.deepStrictEqual(actual, expected)
  })

  it('convertDate', () => {
    const date = '2011-06-01'
    const actual = c.convertDate(date)
    const expected = '2011年6月1日'

    assert.deepStrictEqual(actual, expected)
  })

  it('convertLocation', () => {
    const location = 'gs://bucket/key'
    const actual = c.convertLocation(location)
    const expected = 'https://storage.googleapis.com/bucket/key'

    assert.deepStrictEqual(actual, expected)
  })

  it('splitText', () => {
    const text = 'text\ntext\ntext'
    const actual = c.splitText(text)
    const expected = ['text', 'text', 'text']

    assert.deepStrictEqual(actual, expected)
  })
})
