import path from 'path'
import fsPromises from 'fs/promises'
import sharp from 'sharp'

main()

async function main () {
  try {
    const {pathname} = new URL(import.meta.url)
    const __dirname = path.dirname(pathname)
    const srcdir = path.join(__dirname, '../static/img-original')
    const dstdir = path.join(__dirname, '../static/img')
    const filenames = (await fsPromises.readdir(srcdir))
      .filter(filename => path.extname(filename) === '.jpg')

    await fsPromises.mkdir(dstdir, {recursive: true})

    for (const filename of filenames) {
      const src = path.join(srcdir, filename)
      const dst = path.join(dstdir, filename)

      await sharp(src)
        .jpeg({
          quality: 80,
          mozjpeg: true,
        })
        .toFile(dst)
    }
  } catch (err) {
    console.error(err)
  }
}