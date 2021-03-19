var UserSchema = require("../models/UserSchema");
var {client} = require("../mongo_config");
var {Query, QueryError} = require("..//utils/Query");
var {ValidationError} = require("joi")
var processUserCreation = require("../utils/processUserCreation");


async function createUser(req, res){

    // Validate request parameters
    if (!req.body.email){
        res.status(400);
        res.json({
            error: 400,
            message: "User's email is required"
        })
        return
    }

    if (!req.body.password){
        res.status(400);
        res.json({
            error: 400,
            message: "User's password is required"
        })
        return
    }

    if (!req.body.name){
        res.status(400);
        res.json({
            error: 400,
            message: "User's name is required"
        })
        return
    }

    if (!req.body.role){
        res.status(400);
        res.json({
            error: 400,
            message: "User's role is required"
        })
        return
    }

    if (!req.body.redirectUri){
        res.status(400);
        res.json({
            error: 400,
            message: "Your application's redirect URI is required"
        })
        return
    }

    try{
        var userQuery = new Query(client, "myadmin", "users", UserSchema)

        // Check if user exists
        var query = {
            email: req.body.email.toLowerCase(),
            inventory: req.body.inventory.toLowerCase()
        }
        const user = await userQuery.read(query)
        
        if (user.length > 0){
            res.status(400);
            res.json({
                error: 400,
                message: "User already exists"
            })
            return
        }
        // If no custom role or permissiona verified
        if(!req.body.permissions || req.body.permissions.length === 0){
            var request = {...req.body, userQuery: userQuery}
            var response = await processUserCreation(request, {iscustom:false});

            if (response){
                res.json({
                    message: "Account created, user has to verify email",
                    email_info: response
                })
                return
            }
        }

        var request = {...req.body, userQuery: userQuery}
        var response = await processUserCreation(request, {iscustom:true});

        if (response){
            res.json({
                message: "Account created, user has to verify email",
                email_info: response
            })
            return
        }
    } catch(err){
        // We expect validation errors
        if (err instanceof ValidationError){
            res.status(400);
            res.json({
                error: 400,
                message: err.message
            })
            return
        }

        // For the unexpected errors
        console.log(err);
        console.log("Error occured in createUser logic");
        res.status(500);
        res.send("An internal server error occured")
    }
}


module.exports = createUser;