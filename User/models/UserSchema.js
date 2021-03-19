const Joi = require("joi");

const UserSchema = Joi.object({

    name: Joi.string().required(),

    pwd: Joi.string().required(),

    email: Joi.string().email().required(),

    role: Joi.string().alphanum().required(),

    permissions: Joi.array(),
    
    inventory: Joi.string().alphanum().required(),

    confirmed: Joi.boolean().default(false),

    createdAt: Joi.date().default(new Date()),
})

module.exports = UserSchema;