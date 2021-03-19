const Joi = require("joi");

const OwnerSchema = Joi.object({
    _id: Joi.string().alphanum().required(),

    name: Joi.string().required(),

    inventory: Joi.string().alphanum().required(),

    createdAt: Joi.date().default(new Date()),
})


module.exports = OwnerSchema;