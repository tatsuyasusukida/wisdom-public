export function convertNews (news) {
  return {
    id: news.id,
    date: news.date,
    dateText: convertDateDot(news.date),
    title: news.title,
    text: news.text,
    textLines: splitText(news.text),
    isPublished: news.isPublished,
    site: news.site || null,
  }
}

export function convertNewsImage (newsImage) {
  return {
    id: newsImage.id,
    order: newsImage.order,
    title: newsImage.title,
    alt: newsImage.alt,
    filename: newsImage.filename,
    original: newsImage.original,
    originalUrl: convertLocation(newsImage.original),
    thumbnail: newsImage.thumbnail,
    thumbnailUrl: convertLocation(newsImage.thumbnail),
  }
}

export function convertDateDot (date) {
  date = new Date(date)

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [
    ('' + year).padStart(4, '0'),
    ('' + month).padStart(2, '0'),
    ('' + day).padStart(2, '0'),
  ].join('.')
}

export function convertDate (date) {
  date = new Date(date)

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}年${month}月${day}日`
}

export function convertLocation (location) {
  const {protocol, host, pathname} = new URL(location)

  if (protocol === 'gs:') {
    return `https://storage.googleapis.com/${host}/${pathname}`
  } else {
    return location
  }
}

export function splitText (text) {
  return text.replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
}
