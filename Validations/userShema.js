
const { Schema, model } = require('mongoose')
const Joi = require("joi");

const usertSchema = new Schema(
    { 
        password: {
            type: String,
            required: [true, 'Set password for user'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
            },
        avatarURL: String,
        token: String,
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const User = model("user", usertSchema)

const userSchemaJoi = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
    User,
    userSchemaJoi,
    verifyEmailSchema
}