const Joi = require("joi");

const ImageSchema = Joi.object({

    name: Joi.string().required(),

    url:  Joi.string().regex(/^\S+$/).required(),  // No white space

    createdAt: Joi.date().default(new Date()),

})

module.exports = ImageSchema;