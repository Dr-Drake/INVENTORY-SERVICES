/** owner authentication endpoints*/
const express = require("express");
const api = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const AuthenticateStaff = require("../controllers/AuthenticateStaff");
const CreateUser = require("../controllers/CreateUser");
const DeleteUser = require("../controllers/DeleteUser");
const GetUser = require("../controllers/GetUser");
const UpdateUser = require("../controllers/UpdateUser");
const verifyPermissions = require("../middlewares/verifyPermissions");

api.post("/staffauthentication", AuthenticateStaff);

api.post("/user", verifyToken, verifyPermissions({permission: "createUsers"}), CreateUser);

api.delete("/user", verifyToken, verifyPermissions({permission: "deleteUsers"}), DeleteUser);

api.delete("/user/:inventory/:email", verifyToken, verifyPermissions({permission: "deleteUsers"}), DeleteUser);

api.get("/user", verifyToken, verifyPermissions({permission: "readUsers"}), GetUser);

api.get("/user/:inventory", verifyToken, verifyPermissions({permission: "readUsers"}), GetUser);

api.get("/user/:inventory/:email", verifyToken, verifyPermissions({permission: "readUsers"}), GetUser);

api.put("/user", verifyToken, verifyPermissions({permission: "updateUsers"}), UpdateUser);

module.exports = api;