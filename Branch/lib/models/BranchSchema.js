const Joi = require("joi");

const BranchSchema = Joi.object({
    _id: Joi.string().alphanum().required(),

    name: Joi.string().required(),

    address: Joi.string().required(),

    createdAt: Joi.date().default(new Date()),

})

module.exports = BranchSchema;