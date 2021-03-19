const Joi = require("joi");

const BranchSchema = Joi.object({
    _id: Joi.string().alphanum(),

    name: Joi.string(),

    address: Joi.string(),

    createdAt: Joi.date(),

})

module.exports = BranchSchema;