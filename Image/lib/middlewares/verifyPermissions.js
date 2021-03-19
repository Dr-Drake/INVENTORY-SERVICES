var {client} = require("../configs/mongo_config");
var {Query, QueryError} = require("../utils/Query");
var Permisions = require("../configs/Permissions");
var Roles = require("../configs/Roles");
var Joi = require("joi")

var UserSchema = Joi.object()  // Schema doesn't really matter here
var OwnerSchema = Joi.object()  // Schema doesn't really matter here

const verifyPermissions = ({permission}={}) => async (req, res, next)=>{
    var inventory;

    if (req.headers["x-inventory"]){
        inventory = req.headers["x-inventory"]
    }

    if (req.params.inventory){
        inventory = req.params.inventory
    }

    if (req.query.inventory){
        inventory = req.query.inventory
    }

    if (req.body.inventory){
        inventory = req.body.inventory
    }

    if (!inventory){
        res.status(400);
        res.json({
            error: 400,
            message: "The inventory parameter is required"
        })
        return
    }
    

    // Verify custom role permissions

    if (req.token.role.toLowerCase() === "custom"){
        try{

            var userQuery = new Query(client, "myadmin", "users", UserSchema);
            var query = {
                email: req.token.user,
                inventory: inventory
            }
            
            var result = await userQuery.read(query)
    
            if (result.length > 0){

                // Check permission
                if (result[0].permissions.includes(permission)){
                    next()
                    return
                } else {
                    res.status(401);
                    res.json({
                        error: 401,
                        message: "User is not authorized to perform this action"
                    });
                    return
                }
                        
            }
        } catch (err){
            console.log(err);
            console.log("Error occured while verifying custom role permissions");
            res.status(500);
            res.send("An internal server error occured");
        }
    }


    // verify permissions on inventory
    var role = req.token.role.toLowerCase();

    if (role === "superadmin"){
        try{
            // See if owner can make changes on this inventory
            var ownerQuery = new Query(client, "myadmin", "owners", OwnerSchema);
            var query = {
                _id: req.token.user,
                inventory: inventory.toLowerCase()
            }
            var result = await ownerQuery.read(query)

            if (result.length > 0){

               next()
               return
            } else{
                res.status(403);
                res.json({
                    error: 403,
                    message: "This action is forbidden for the user"
                });
                return
            }

        } catch (err){
            console.log(err);
            console.log("Error occured while verifying superadmin inventory level permission");
            res.status(500);
            res.send("An internal server error occured");
        }
    }

    if(Roles[role].includes(permission)){
        try{
            // See if user can make changes on this inventory
            var userQuery = new Query(client, "myadmin", "users", UserSchema);
            var query = {
                email: req.token.user,
                inventory: inventory
            }
            var result = await userQuery.read(query)
            
            if (result.length > 0){
               next()
               return
            } else{
                res.status(403);
                res.json({
                    error: 403,
                    message: "This action is forbidden for the user"
                });
                return
            }

        } catch (err){
            console.log(err);
            console.log("Error occured while verifying superadmin inventory level permission");
            res.status(500);
            res.send("An internal server error occured");
        }
    }


    // Otherwise unauthorized
    res.status(401);
    res.json({
        error: 401,
        message: "User is not authorized to perform this action"
    });

}

module.exports = verifyPermissions