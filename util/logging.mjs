import path from 'path'
import winston from 'winston'

export function makeLogger (level, format, file) {
  return {
    level: level,
    format: makeFormat(format),
    transports: [
      makeTransportFile(file),
      ...(process.env.LOG_CONSOLE === '1' ? [makeTransportConsole()] : [])
    ],
  }
}

export function makeFormat (format) {
  if (format === 'json') {
    return makeFormatJson()
  } else if (format === 'raw') {
    return makeFormatRaw()
  } else {
    throw new TypeError(`invalid format: '${format}'`)
  }
}

export function makeFormatJson () {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  )
}

export function makeFormatRaw () {
  return winston.format.printf(({message}) => message)
}

export function makeTransportFile (filename) {
  const dirname = process.env.LOG_DIRNAME || path.join(process.cwd(), 'log')

  if (process.env.LOG_ROTATION === '1') {
    return new winston.transports.File({
      dirname,
      filename,
      maxsize: 1 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
    }) 
  } else {
    return new winston.transports.File({
      dirname,
      filename,
    }) 
  }
}

export function makeTransportConsole () {
  return new winston.transports.Console({
    format: makeFormatRaw(),
  })
}
