/** owner authentication endpoints*/
const express = require("express");
const api = express.Router();
const {createOwner} = require("./utils/createOwner")


api.post("/createowner", async (req, res)=>{
    var doc = {
        _id: "Heyy",
        name: "Jake",
        inventory: "Hubmart",
    }
    try{
        const result = await createOwner(doc);

        if (result){
            res.json(result)
        }
    } catch(err){
        console.log(err)
        console.log("Error in creating owner")
        res.status(500);
        res.json({
            error: 500,
            message: "Error in creating owner"
        })
    }
});

module.exports = api;