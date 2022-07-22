import * as f from './form.mjs'
import assert from 'assert'

describe('form', () => {
  it('makeFormContact', () => {
    const actual = f.makeFormContact()
    const expected = {
      name: '',
      phone: '',
      email: '',
      zip: '',
      address: '',
      contactCategoryId: '',
      text: '',
    }

    assert.deepStrictEqual(actual, expected)
  })
})
