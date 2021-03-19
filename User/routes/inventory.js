/** owner authentication endpoints*/
const express = require("express");
const api = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const verifyPermissions = require("../middlewares/verifyPermissions");
const createInventory = require("../controllers/CreateInventory");
const deleteInventory = require("../controllers/DeleteInventory");

api.post("/inventory", verifyToken, createInventory);
api.delete("/inventory", verifyToken, verifyPermissions({permission: "DeleteInventory"}), deleteInventory);
api.delete("/inventory/:inventory", verifyToken, verifyPermissions({permission: "DeleteInventory"}), deleteInventory);

//api.get("/inve")

module.exports = api;