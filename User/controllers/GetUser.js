var UserSchema = require("../models/UserSchema");
var {client} = require("../mongo_config");
var {Query, QueryError} = require("../utils/Query");
var {ValidationError} = require("joi");
var makeLowercase = require("../utils/makeLowerCase");


async function getUser(req, res){
    var inv;
    var email;

    if (req.params.inventory){
        inv = req.params.inventory.toLowerCase()
    }

    if (req.query.inventory){
        inv = req.query.inventory.toLowerCase()
    }

    if (req.params.email){
        email = req.params.email.toLowerCase()
    }



    try{
        var userQuery = new Query(client, "myadmin", "users", UserSchema);
        var projection = {
            _id: 0,
            pwd: 0
        }
        
        if (email){
            var query = {
                email: email
            }
        } else{

            // Format to lowercase
            var list = makeLowercase([req.query]);
            var query = list[0];
        }
        // Find user(s)
        var result = await userQuery.read(query, projection);

        if (result){
            res.json(result)
            return
        }
    }catch(err){

        // Not expecting any error
        console.log(err);
        console.log("Error occured while retrieving user");
        res.status(500);
        res.send("An internal server error occured")
    }


}

module.exports = getUser;