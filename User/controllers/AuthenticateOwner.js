const {generateToken, generateRefreshToken} = require("../utils/token_utils")
const {authenticateBankUser} = require("../utils/dummyAuthentication")
const OwnerSchema = require("../models/OwnerSchema");
const {Query, QueryError} = require("../utils/Query");
const {client} = require("../mongo_config");

async function OwnerAuthentication(req, res){

    // Validate payload
    if (!req.body){
        res.status(400)
        res.json({
            error: 400,
            message: "Username and Password are required"
        })
        return;
    }

    if (!req.body.username){
        res.status(400)
        res.json({
            error: 400,
            message: "Username is required"
        })
        return;
    }

    if (!req.body.password){
        res.status(400)
        res.json({
            error: 400,
            message: "Password is required"
        })
        return;
    }

    // Authenticate Bank registered merchant
    const response = authenticateBankUser(req.body.username, req.body.password);
    if (response === false){
        res.status(400)
        res.json({
            error: 400,
            user: false,
        })

        return
    }
 
    
    try{
        // Get name from authentication result
        var id = response.id
        var name = response.user

        // Tokens
        const accessToken = generateToken(id, name, "superAdmin")
        const refreshToken = generateRefreshToken(id, name, "superAdmin")

        // Check if user has inventory
        var ownerQuery = new Query(client, "myadmin", "owners", OwnerSchema);
        const result = await ownerQuery.read({_id: id})

        // If array is empty -- No Inventory for user
        if (result.length === 0){
            const payload = {
                accessToken: accessToken,
                inventory: false
            }

            // Set refresh Token in cookie
            res.cookie("jwt", refreshToken, {
                maxAge: 1000 * 60 * 60 , // 1 hour
                httpOnly: true
            })
            res.json(payload)
            return
        }

        // If user has inventory
        if (result){
            const payload = {
                accessToken: accessToken,
                inventory: result[0].inventory
            }
            // Set refresh Token in cookie
            res.cookie("jwt", refreshToken, {
                maxAge: 1000 * 60 * 60 , // 1 hour
                httpOnly: true
            })

            res.json(payload)
            return
        }
        
    } catch(err){
        console.log(err)
        console.log("Error while checking for Inventory")
        res.status(500)
        res.send("Internal server error")
    }

}

module.exports = OwnerAuthentication;