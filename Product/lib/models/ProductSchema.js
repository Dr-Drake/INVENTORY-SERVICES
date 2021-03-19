const Joi = require("joi");
const { ValidationError, func} = require("joi");

const ProductSchema = Joi.object({

    _id: Joi.string().alphanum().required(),

    name: Joi.string().required(),

    category: Joi.string().required(),

    branch: Joi.string().alphanum().required(),

    price: Joi.number().required(),

    image: Joi.string().regex(/^\S+$/),  // No white space

    createdAt: Joi.date().default(new Date()),

})

module.exports = ProductSchema;