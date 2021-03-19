const {generateToken, generateRefreshToken} = require("../utils/token_utils")
const {Query, QueryError} = require("../utils/Query");
const StaffSchema = require("../models/UserSchema");
const {client} = require("../mongo_config");
const bcrypt = require("bcrypt");



async function StaffAuhtentication(req, res){

    // Validate payload
    if (!req.body){
        res.status(400)
        res.json({
            error: 400,
            message: "User's email and Password are required"
        })
        return;
    }

    if (!req.body.email){
        res.status(400)
        res.json({
            error: 400,
            message: "User's email is required"
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

    if (!req.body.inventory){
        res.status(400)
        res.json({
            error: 400,
            message: "Inventory is required"
        })
        return;
    }

    try{
    
        // Check for user in database
        var staffQuery = new Query(client, "myadmin", "users", StaffSchema);
        var query = {
            email: req.body.email,
            inventory: req.body.inventory.toLowerCase(),
        }
        var staff = await staffQuery.read(query);


        // If user hasn't confirmed their email they should do so
        if (staff.length > 0 && !staff[0].confirmed){
            res.status(401);
            res.json({
                error: 401,
                user: true,
                message: "User has not verified email address"
            })
            return
        }

        // If user exists confirm password
        if (staff.length > 0){

            // Confirm password
            var user = staff[0]
            var match = await bcrypt.compare(req.body.password, user.pwd)

            if (match){
                // Tokens
                const accessToken = generateToken(user.email, user.name, user.role)
                const refreshToken = generateRefreshToken(user.email, user.name, user.role)
                const payload = {
                    accessToken: accessToken,
                    user: user.name,
                    inventory: user.inventory
                }

                // Set refresh Token in cookie
                res.cookie("jwt", refreshToken, {
                    maxAge: 1000 * 60 * 60 , // 1 hour
                    httpOnly: true
                })

                console.log(payload)
                res.json(payload)
                return
            }

            // Password doesn't match
            res.status(400)
            res.json({
                error: 400,
                user: false,
                message: "Invalid password"
            })
            return

            
        }

        // This staff is not found in the inventory
        const payload = {
            error: 400,
            user: false,
            message: `User not found in this inventory`
        }
        res.status(400)
        res.json(payload)




    } catch(err){
        console.log(err)
        console.log("Error encountered while authenticating staff");

        res.status(500)
        res.send("An internal server error occured")
        
    }
    

}

module.exports = StaffAuhtentication;