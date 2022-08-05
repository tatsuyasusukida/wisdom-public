import assert from 'assert'
import puppeteer from 'puppeteer'

describe('ui', function () {
  it('contact', async function () {
    const browser = await puppeteer.launch({
      headless: false,
    })

    try {
      const page = await browser.newPage()

      await page.goto(process.env.BASE_URL + '/contact/')

      await page.waitForSelector('.contact-form')

      await page.click('button[type="submit"]')

      await page.waitForSelector('.contact-form dl.is-review')

      await page.click('button[type="submit"]')

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      await browser.close()
    }
  }).timeout(5000)
})
