const {generateToken} = require("../utils/token_utils")
const jwt = require("jsonwebtoken");
var {Query, QueryError} = require("../utils/Query");
var {client} = require("../mongo_config");
var Joi = require("joi");
var dummySchema = Joi.object();

async function RefreshToken(req, res){

    // Verify the token
    var secret = process.env.REFRESH_SIGNATURE
    var token = req.cookies.jwt

    try{
        var decoded = await jwt.verify(token, secret);

        if (decoded){
            var {user, name, role} = decoded

            // Generate new token
            var accessToken = generateToken(user, name, role);

            // Check for inventory in both collections
            var ownerQuery = new Query(client, "myadmin", "owners", dummySchema);
            var userQuery = new Query(client, "myadmin", "users", dummySchema);
            var query = {
                _id: user
            }

            var owner = await ownerQuery.read(query);

            if (owner.length > 0){
                res.json({
                    accessToken: accessToken,
                    inventory: owner[0].inventory
                })
                return
            }

            var user = userQuery.read(query)

            if (user.length > 0){
                res.json({
                    accessToken: accessToken,
                    inventory: user[0].inventory
                })
                return
            }


            // Suggests that inventory is false if neither yield results
            res.json({
                accessToken: accessToken,
                inventory: false
            })
            return
        }
    }catch(err){

        // We expect a JsonWebTokenError
        if (err.name = "JsonWebTokenError"){
            console.log(err)
            res.status(401)
                res.json({
                    error: 401,
                    message: "Unauthorized"
                })
                return;
        }
        
        // For unexpected error
        console.log(err);
        console.log("Error occured when refreshing token");
        res.status(500);
        res.send("An internal server error occurred");

    }
    
}

module.exports = RefreshToken;