const jwt = require("jsonwebtoken");

function generateToken(userID, name, role){
    var tokenpayload = {
        user: userID,
        name: name,
        role: role
    }
    
    var secretKey = process.env.TOKEN_SIGNATURE
    
    const options = {
        expiresIn: (1000 * 60 * 30).toString()  // 30 minutes
    }
    
    var accessToken = jwt.sign(tokenpayload, secretKey, options)

    return accessToken
}


function generateRefreshToken(userID, name, role){
    var tokenpayload = {
        user: userID,
        name: name,
        role: role
    }
    
    var secretKey = process.env.REFRESH_SIGNATURE
    
    const options = {
        expiresIn: (1000 * 60 * 60).toString()  // 1 hour
    }
    
    var accessToken = jwt.sign(tokenpayload, secretKey, options)

    return accessToken
}

module.exports = {generateToken, generateRefreshToken};