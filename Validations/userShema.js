
const { Schema, model } = require('mongoose')

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

module.exports = {
  User
}