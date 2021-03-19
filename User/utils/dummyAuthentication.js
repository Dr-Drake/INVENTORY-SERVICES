function authenticateBankUser(username, password){
    if (username === "Hubmart" && password === "123456"){
        return {user: "FinTech", merchant: "Hubmart", id: "1001"}
    }

    if (username === "Techmart" && password === "123456"){
        return {user: "Ikem", merchant: "Techmart", id: "1002"}
    }

    if (username === "IntroTech" && password === "123456"){
        return {user: "Drake", merchant: "IntroTech", id: "1003"}
    }

    return false
}

module.exports = {authenticateBankUser}