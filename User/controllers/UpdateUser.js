var UserSchema = require("../models/UserSchema");
var UserUpdateSchema = require("../models/UserUpdateSchema");
var {client} = require("../mongo_config");
var {Query, QueryError} = require("..//utils/Query");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

async function updateUser(req, res){

    var email;

    if (req.body.email){
        email = req.body.email.toLowerCase()
    }

    if (!email){
        res.status(400);
        res.json({
            erro: 400,
            message: "User's email is required"
        })
        return
    }
    
    try{
        var userQuery = new Query(client, "myadmin", "users", UserSchema, {updateSchema:UserUpdateSchema});

        // Update use
        var filter = {
            email: email
        }

        //Format to lowercase
        var list = makeLowerCase([req.body]);
        var update = list[0]
        var result = await userQuery.update(filter, update);

        if (result){
            res.json(result.result)
            return
        }
    }catch(err){


        // We expect a Validation Error
        if (err instanceof ValidationError){
            console.log(err)
            res.status(400);
            res.json({
                error: 400,
                message: err.message
            })
            return
        }

        // For the unexpected errors
        console.log(err);
        console.log("Error occured while updating user/ staff");
        res.status(500);
        res.send("An internal server error has occured");
    }

}

module.exports = updateUser;