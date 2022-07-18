export function makeValidationContact () {
  return {
    ok: null,
    name: {ok: null, isNotEmpty: null},
    phone: {ok: null, isNotEmpty: null},
    email: {ok: null, isNotEmpty: null},
    zip: {ok: null, isSevenDigit: null},
    address: {ok: null, isNotEmpty: null},
    contactCategoryId: {ok: null, isNotEmpty: null},
    text: {ok: null, isNotEmpty: null},
  }
}

export async function validateContact (req) {
  const validation = makeValidationContact()

  validation.name.ok =
  validation.name.isNotEmpty = !/^\s*$/.test(req.body.form.name)

  validation.phone.ok =
  validation.phone.isNotEmpty = !/^\s*$/.test(req.body.form.phone)

  validation.email.ok =
  validation.email.isNotEmpty = !/^\s*$/.test(req.body.form.email)

  validation.zip.ok =
  validation.zip.isSevenDigit = /^\d{7}$/.test(req.body.form.zip)

  validation.address.ok =
  validation.address.isNotEmpty = !/^\s*$/.test(req.body.form.address)

  validation.contactCategoryId.ok =
  validation.contactCategoryId.isNotEmpty = !/^\s*$/.test(req.body.form.contactCategoryId)

  validation.text.ok =
  validation.text.isNotEmpty = !/^\s*$/.test(req.body.form.text)

  validation.ok = Object.keys(validation).every((key) => {
    return key === 'ok' || validation[key].ok
  })

  return validation
}
