const Joi = require("joi");

const schemaPostContact = Joi.object({
  name: Joi.string()
    .min(3)
    .pattern(/^[A-Za-z\s.\-']*$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  phone: Joi.string()
    .min(6).max(10)
    .required(),
});

const schemaPutContact = Joi.object({
  name: Joi.string()
    .min(3)
    .pattern(/^[A-Za-z\s.\-']*$/),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  phone: Joi.string().min(6).max(10)
}).or("name", "email", "phone");

module.exports = {
  schemaPostContact,
  schemaPutContact,
};