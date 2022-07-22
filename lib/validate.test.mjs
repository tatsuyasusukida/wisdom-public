import * as v from './validate.mjs'
import assert from 'assert'

describe('validate', () => {
  it('makeValidationContact', () => {
    const actual = v.makeValidationContact()
    const expected = {
      ok: null,
      name: {ok: null, isNotEmpty: null},
      phone: {ok: null, isNotEmpty: null},
      email: {ok: null, isNotEmpty: null},
      zip: {ok: null, isSevenDigit: null},
      address: {ok: null, isNotEmpty: null},
      contactCategoryId: {ok: null, isNotEmpty: null},
      text: {ok: null, isNotEmpty: null},
    }

    assert.deepStrictEqual(actual, expected)
  })

  it('validateContact', async () => {
    const req = {
      body: {
        form: {
          name: 'name',
          phone: 'phone',
          email: 'email',
          zip: '1234567',
          address: 'address',
          contactCategoryId: '1',
          text: 'text',
        }
      }
    }

    const actual = await v.validateContact(req)
    const expected = {
      ok: true,
      name: {ok: true, isNotEmpty: true},
      phone: {ok: true, isNotEmpty: true},
      email: {ok: true, isNotEmpty: true},
      zip: {ok: true, isSevenDigit: true},
      address: {ok: true, isNotEmpty: true},
      contactCategoryId: {ok: true, isNotEmpty: true},
      text: {ok: true, isNotEmpty: true},
    }

    assert.deepStrictEqual(actual, expected)
  })

  it('isNotEmptyFalse', () => {
    const value = ' \t\n'
    const actual = v.isNotEmpty(value)
    const expected = false

    assert.deepStrictEqual(actual, expected)
  })

  it('isNotEmptyTrue', () => {
    const value = 'not empty'
    const actual = v.isNotEmpty(value)
    const expected = true

    assert.deepStrictEqual(actual, expected)
  })

  it('isSevenDigitFalse', () => {
    const value = 'value'
    const actual = v.isSevenDigit(value)
    const expected = false

    assert.deepStrictEqual(actual, expected)
  })

  it('isSevenDigitTrue', () => {
    const value = '1234567'
    const actual = v.isSevenDigit(value)
    const expected = true

    assert.deepStrictEqual(actual, expected)
  })
})
