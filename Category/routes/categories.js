var express = require("express");
var verifyToken = require("../lib/middlewares/verifyToken");
var verifyPermissions = require("../lib/middlewares/verifyPermissions");
var CreateCategory = require("../lib/controllers/CreateCategory");
var ReadCategory = require("../lib/controllers/ReadCategory");
var UpdateCategory = require("../lib/controllers/UpdateCategory");
var DeleteCategory = require("../lib/controllers/DeleteCategory");
var api = express.Router();

api.post("/categories", verifyToken, 
verifyPermissions({permission: "createCategories"}), CreateCategory);

api.post("/categories/delete", verifyToken, 
verifyPermissions({permission: "deleteCategories"}), DeleteCategory);

api.get("/categories/:inventory", verifyToken, 
verifyPermissions({permission: "readCategories"}), ReadCategory);

api.get("/categories/:inventory/:name", verifyToken, 
verifyPermissions({permission: "readCategories"}), ReadCategory);

api.get("/categories", verifyToken, 
verifyPermissions({permission: "readCategories"}), ReadCategory);

api.put("/categories", verifyToken, 
verifyPermissions({permission: "updateCategories"}), UpdateCategory);


module.exports = api;