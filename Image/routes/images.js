var express = require("express");
var verifyToken = require("../lib/middlewares/verifyToken");
var verifyPermissions = require("../lib/middlewares/verifyPermissions");
var UploadImage = require("../lib/controllers/UploadImage");
var ReadImage = require("../lib/controllers/ReadImage");
var DeleteImage = require("../lib/controllers/DeleteImage");
var UpdateImage = require("../lib/controllers/UpdateImage");
var upload = require("../lib/middlewares/upload");
var multer = require("multer");
var formParser = multer();  // To parse texts from form data
var api = express.Router();

api.post("/images", verifyToken,
verifyPermissions({permission: "createImages"}), upload.any(), UploadImage);

api.get("/images", verifyToken, 
verifyPermissions({permission: "readImages"}), ReadImage);

api.get("/images/:inventory", verifyToken, 
verifyPermissions({permission: "readImages"}), ReadImage);

api.get("/images/:inventory/:name", verifyToken, 
verifyPermissions({permission: "readImages"}), ReadImage);

api.post("/images/delete", verifyToken, 
verifyPermissions({permission: "deleteImages"}), DeleteImage);

api.put("/images", verifyToken, 
verifyPermissions({permission: "updateImages"}), UpdateImage);



module.exports = api;