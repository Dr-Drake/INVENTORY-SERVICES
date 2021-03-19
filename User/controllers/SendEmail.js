const sendEmail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const {host} = require("../configs/mail_config");

// POST operation
async function send(req, res){

    // Validate request parameters
    if (!req.body.email){
        res.status(400);
        res.json({
            error: 400,
            message: "User's email is required"
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
        var {email, redirectUri} = req.body

        var payload = {
            email: email,
            redirectUri: redirectUri
        }

        var SECRET = process.env.EMAIL_SIGNATURE
        var options = {
            expiresIn: (1000 * 60 * 60 * 24).toString()  // 24 hrs or 1 day
        }

        var token = jwt.sign(payload,SECRET, options);
        var activationLink = `${host}/api/accounts/confirmation/${token}`

        // Send Confirmation email
        const info = await sendEmail(email, activationLink);

        if (info){
            res.json({
                message: "Confirmation email has been sent",
                messageId: info.messageId
            })
            return
        }

    } catch(err){
        console.log(err)
        console.log("Error occured while sending confirmation email")
        res.status(500);
        res.send("An internal server error occured");
    }
}

module.exports = send