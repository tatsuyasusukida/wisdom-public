import assert from 'assert'
import fetch from 'node-fetch'

describe('api', function () {
  describe('contact', function () {
    const baseUrl = process.env.BASE_URL + '/api/v1/contact/'

    describe('initialize', function () {
      const url = baseUrl + 'initialize'

      it('ok', async function () {
        const response = await fetch(url, makeGetOptions())
        const actual = await response.json()

        assert.deepStrictEqual(typeof actual.form, 'object')
        assert.deepStrictEqual(typeof actual.validation, 'object')
      })
    })

    describe('validate', function () {
      const url = baseUrl + 'validate'

      it('ok', async function () {
        const body = makeDefaultBody()
        const response = await fetch(url, makePostOptions(body))
        const actual = await response.json()

        assert.deepStrictEqual(typeof actual.validation, 'object')
        assert.deepStrictEqual(actual.validation.ok, true)
      })
    })

    describe('submit', function () {
      const url = baseUrl + 'submit'

      it('ok', async function () {
        const body = makeDefaultBody()
        const response = await fetch(url, makePostOptions(body))
        const actual = await response.json()

        assert.deepStrictEqual(actual.ok, true)
        assert.deepStrictEqual(/^\/contact\/finish\/\?number=\d{4}-\d{4}-\d{4}$/.test(actual.redirect), true)
      })
    })
  })
})

function makeGetOptions () {
  return {
    method: 'GET',
    headers: {
      'Cookie': 'appSession=' + process.env.APP_SESSION,
    },
  }
}

function makePostOptions (body) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cookie': 'appSession=' + process.env.APP_SESSION,
    },
    body: JSON.stringify(body),
  }
}

function makeDefaultBody () {
  return {
    form: {
      name: 'name',
      phone: 'phone',
      email: 'susukida@loremipsum.co.jp',
      zip: '1234567',
      address: 'address',
      contactCategoryId: '1',
      text: 'text',
    },
  }
}
