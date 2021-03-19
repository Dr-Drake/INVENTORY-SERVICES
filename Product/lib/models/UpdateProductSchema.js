const Joi = require("joi");

// Nothing here is required

const UpdateProductSchema = Joi.object({

    _id: Joi.string().alphanum(),

    name: Joi.string(),

    category: Joi.string(),

    branch: Joi.string().alphanum(),

    price: Joi.number(),

    image: Joi.string().regex(/^\S+$/),  // No white space
    
    createdAt: Joi.date()

})

module.exports = UpdateProductSchema;