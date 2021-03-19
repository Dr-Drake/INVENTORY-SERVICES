var UserSchema = require("../models/UserSchema");
var {client} = require("../mongo_config");
var {Query, QueryError} = require("..//utils/Query");
var {ValidationError} = require("joi")


async function deleteUser(req, res){

    var email;

    if (req.params.email){
        email = req.params.email.toLowerCase();
    }

    if (req.query.email){
        email = req.query.email.toLowerCase();
    }

    // If email parameter is missing -- Let them know
    if (!email){
        res.status(400);
        res.json({
            error: 400,
            message: "User's email is required"
        })
        return
    }

    try{
        var userQuery = new Query(client, "myadmin", "users", UserSchema);
        var deleteFilter = {email: {$eq: email}};
        var result = await userQuery.delete(deleteFilter);

        if (result){
            res.json({
                message: "success",
                result: result.result,
            })
        }
    } catch (err){

        // Not expecting any errors
        console.log(err);
        console.log("Error occured in DeleteUser logic");
        res.status(500);
        res.send("An internal server error occured")
    }
    
}


module.exports = deleteUser;