var express = require("express");
var verifyToken = require("../lib/middlewares/verifyToken");
var verifyPermissions = require("../lib/middlewares/verifyPermissions");
var CreateBranch = require("../lib/controllers/CreateBranch");
var ReadBranch = require("../lib/controllers/ReadBranch");
var UpdateBranch = require("../lib/controllers/UpdateBranch");
var DeleteBranch = require("../lib/controllers/DeleteBranch");
var api = express.Router();

api.post("/branches", verifyToken, 
verifyPermissions({permission: "createBranches"}), CreateBranch);

api.delete("/branches", verifyToken, 
verifyPermissions({permission: "deleteBranches"}), DeleteBranch);

api.delete("/branches/:inventory", verifyToken, 
verifyPermissions({permission: "deleteBranches"}), DeleteBranch);

api.delete("/branches/:inventory/:id", verifyToken, 
verifyPermissions({permission: "deleteBranches"}), DeleteBranch);

api.get("/branches/:inventory", verifyToken, 
verifyPermissions({permission: "readBranches"}), ReadBranch);

api.get("/branches/:inventory/:id", verifyToken, 
verifyPermissions({permission: "readBranches"}), ReadBranch);

api.get("/branches", verifyToken, 
verifyPermissions({permission: "readBranches"}), ReadBranch);

api.put("/branches", verifyToken, 
verifyPermissions({permission: "updateBranches"}), UpdateBranch);


module.exports = api;