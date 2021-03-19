/** owner authentication endpoints*/
const express = require("express");
const api = express.Router();
const createDatabase = require("./utils/createDatabase")


api.post("/createdb", async (req, res)=>{
    try{
        const result = await createDatabase("Hubmart");

        if (result){
            res.json(result)
        }
    } catch(err){
        console.log(err)
        console.log("Error in creating database")
        res.status(500);
        res.json({
            error: 500,
            message: "Error in creating database"
        })
    }
});

module.exports = api;