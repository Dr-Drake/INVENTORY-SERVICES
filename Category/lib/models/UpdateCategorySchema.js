const Joi = require("joi");

const UpdateCategorySchema = Joi.object({

    name: Joi.string(),

    inventory: Joi.string().alphanum().required(),

    createdAt: Joi.date(),

})

module.exports = UpdateCategorySchema;