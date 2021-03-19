const Joi = require("joi");


// Here none of the parameters are required, and there are no defaults
const UserSchema = Joi.object({

    name: Joi.string(),

    pwd: Joi.string().alphanum(),

    email: Joi.string().email(),

    role: Joi.string().alphanum(),

    permissions: Joi.array(),
    
    inventory: Joi.string().alphanum(),

    confirmed: Joi.boolean(),

    createdAt: Joi.date(),
})

module.exports = UserSchema;