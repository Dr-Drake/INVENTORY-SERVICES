/** owner authentication endpoints*/
const express = require("express");
const api = express.Router();
const ConfirmEmail = require("../controllers/ConfirmEmail");
const SendEmail = require("../controllers/SendEmail");

api.post("/confirmation", SendEmail);
api.get("/confirmation/:token", ConfirmEmail);


module.exports = api;