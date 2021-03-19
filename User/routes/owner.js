/** owner authentication endpoints*/
const express = require("express");
const api = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const AuthenticateOwner = require("../controllers/AuthenticateOwner");

api.post("/ownerauthentication", AuthenticateOwner);

module.exports = api;