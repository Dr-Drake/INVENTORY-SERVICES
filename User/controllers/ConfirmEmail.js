var jwt = require("jsonwebtoken");
var {Query, QueryError} = require("../utils/Query");
var UserSchema = require("../models/UserSchema");
var updateSchema = require("../models/UserUpdateSchema");
var {client} = require("../mongo_config")

// GET Operation
async function confirmEmail(req, res){
    var SECRET = process.env.EMAIL_SIGNATURE

    // Verify Token
    jwt.verify(req.params.token, SECRET, (err, decoded)=>{

        if (err){
            res.status(403);
            res.json({
                error: 403,
                message: "Unauthorized operation"
            })
            return
        }

        // Update user as confirmed
        var filter = {
            email: decoded.email
        };

        var update = {
            confirmed: true
        };

        var userQuery = new Query(client, "myadmin", "users", UserSchema, {updateSchema: updateSchema});

        userQuery.update(filter, update).then((result)=>{

            console.log(result.result)

            // Redirect to where specified
            var realRedirect = decoded.redirectUri+ "?confirmed=true"
            res.redirect(realRedirect)

        }).catch((err)=>{
            console.log(err);
            console.log("An unexpected error occured while confirming email");
            res.status(500);
            res.send("An internal server error occured")
        })
    })
    
}


module.exports = confirmEmail;