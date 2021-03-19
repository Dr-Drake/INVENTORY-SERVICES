/** owner authentication endpoints*/
const express = require("express");
const api = express.Router();
const RefreshToken = require("../controllers/RefreshToken");

api.get("/refreshToken", RefreshToken);

module.exports = api;