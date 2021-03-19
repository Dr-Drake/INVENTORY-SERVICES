const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next){

    var accessToken;
    
    // Check the authorization header
    if (!req.headers.authorization){
        // no access token got provided - cancel
        res.set("WWW-Authentiacte", "Bearer");
        res.sendStatus("401");
        return;
    }

    var parts = req.headers.authorization.split(" ")
        if (parts.length < 2){
            
            // no access token got provided - cancel
           res.set("WWW-Authentiacte", "Bearer");
           res.sendStatus("401");
           return;
        }

        accessToken = parts[1];

        var secret = process.env.TOKEN_SIGNATURE
        jwt.verify(accessToken, secret, (err, decoded)=>{
            if (err){
                res.status(401)
                res.json({
                    error: 401,
                    message: "Unauthorized"
                })
                return;
            }

            if (decoded){
                req.token = decoded
                next()
                return;
            }
        })
}

module.exports = verifyToken;