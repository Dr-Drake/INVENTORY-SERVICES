const nodemailer = require("nodemailer");

// Transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: 'gtfintech@gmail.com',  // Should be env variable
        pass: 'rncvncbwdrixbscw'  // Should be env variable
    }
});

/**
 * @function
 * @description Sends a confirmation email with the activation link
 * @param {String} email 
 * @param {String} actiavtionLink 
 */
function sendEMail(email, actiavtionLink){
    const willSendEmail = new Promise(async (resolve, reject)=>{
        try{
            let info = await transporter.sendMail({
                from: `"Inventory Service" <gtfintech@gmail.com>`,
                to: email,
                subject: "Confirm email to Activate your account",
                text: `Please click this link to confirm your email: ${actiavtionLink}`,
                html: `<p>Please click this link to confirm your email: <a href=${actiavtionLink}>${actiavtionLink}</a></p>`
            })
    
            if (info){
                console.log(`Message sent: ${info.messageId}`)
                resolve(info)
            }
        }catch(err){
            console.log("Error occured while sending confirmation email");
            reject(err)
        }
    })    
    return willSendEmail;
}

module.exports = sendEMail;