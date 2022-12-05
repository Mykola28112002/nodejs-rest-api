const { Schema, model } = require('mongoose')
const Joi = require("joi");
const contactSchema = new Schema(
  {
    owner: {
      type: Schema.ObjectId,
      ref: 'users',
    },
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  }
);

const Contact = model("contact", contactSchema)

const contactSchemaJoi = Joi.object({
  name: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.number().integer().required(),
  favorite: Joi.bool(),
});

const favoriteContactSchema = Joi.object({
  favorite: Joi.bool().required(),
});

module.exports = {
  Contact,
  contactSchemaJoi,
  favoriteContactSchema
}
