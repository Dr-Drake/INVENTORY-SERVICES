var axios = require("axios");
var bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
var makeLowerCase = require("./makeLowerCase");
var {host} = require("../configs/mail_config")


/**
 * @function
 * @description Utility function to help create users in the controller logic.
 * @param {JSON} request 
 * @param {JSON} options 
 */
async function processUserCreation(request, {iscustom}={}){

    var clone = {...request}
    //delete clone["password"]  // We want password to be case sensitive

    // Format to lowercase
    var list = makeLowerCase([clone]);
    var realRequest = list[0];

    var {email, userQuery, inventory, role, permissions, redirectUri, name} = realRequest;
    var {password} = request;

    const willProcess = new Promise(async(resolve, reject)=>{

        try{
            // If not, create user
            var saltRounds = 10;
            var phash = await bcrypt.hash(password, saltRounds)  // Hash password
    
            if (phash){
                if (iscustom){
                    var document = {
                        email: email.toLowerCase(),
                        name: name.toLowerCase(),
                        inventory: inventory.toLowerCase(),
                        role: role,
                        pwd: phash,
                        permissions: permissions
                    }
                } else{
                    var document = {
                        email: email,
                        name: name,
                        inventory: inventory.toLowerCase(),
                        role: role,
                        pwd: phash,
                    }
                }
    
                // Create user
                var result = await userQuery.create([document])
    
                if (result){
                    // Send confirmation email
                    var data = {
                        email: email,
                        redirectUri: redirectUri,
                    }
            
                    var SECRET = process.env.EMAIL_SIGNATURE
                    var options = {
                        expiresIn: (1000 * 60 * 60 * 24).toString()  // 24 hrs or 1 day
                    }
            
                    var token = jwt.sign(data, SECRET, options);
                    var activationLink = `${host}/confirmation/${token}`
            
                    // Send Confirmation email
                    console.log(email)
                    const info = await sendEmail(email, activationLink);
            
                    if (info){
                        resolve(info)
                    }
        
                }
            }
            
    
        } catch(err){
            reject(err);
        }
    })

    return willProcess;
}

module.exports = processUserCreation;