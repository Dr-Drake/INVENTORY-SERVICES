const Joi = require("joi");

const UpdateImageSchema = Joi.object({

    name: Joi.string(),

    url:  Joi.string().regex(/^\S+$/),  // No white space

    createdAt: Joi.date(),

})

module.exports = UpdateImageSchema;