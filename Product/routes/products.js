var express = require("express");
var verifyToken = require("../lib/middlewares/verifyToken");
var verifyPermissions = require("../lib/middlewares/verifyPermissions");
var ReadProduct = require("../lib/controllers/ReadProduct");
var CreateProduct = require("../lib/controllers/CreateProduct");
var UpdateProduct = require("../lib/controllers/UpdateProduct");
var DeleteProduct = require("../lib/controllers/DeleteProduct");
var api = express.Router();


api.get("/products", verifyToken, 
verifyPermissions({permission: "readProducts"}), ReadProduct);

api.get("/products/:inventory", verifyToken, 
verifyPermissions({permission: "readProducts"}), ReadProduct);

api.get("/products/:inventory/:id", verifyToken, 
verifyPermissions({permission: "readProducts"}), ReadProduct);

api.post("/products", verifyToken, verifyPermissions({permission: "createProducts"}), CreateProduct);

api.post("/products/delete", verifyToken, 
verifyPermissions({permission: "deleteProducts"}), DeleteProduct);

api.put("/products", verifyToken, verifyPermissions({permission: "updateProducts"}), UpdateProduct);

module.exports = api;