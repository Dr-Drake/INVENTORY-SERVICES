const Joi = require("joi");

const CategorySchema = Joi.object({

    name: Joi.string().required(),

    inventory: Joi.string().alphanum().required(),

    createdAt: Joi.date().default(new Date()),

})

module.exports = CategorySchema;