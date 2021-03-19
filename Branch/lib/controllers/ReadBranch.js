const {Query} = require("../utils/Query");
const BranchSchema = require("../models/BranchSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");


// Get Operation
async function ReadBranch(req, res) {

    if (req.params.inventory){
        console.log(req.params)
        try{
            var dbname = req.params.inventory.toLowerCase()
            var ReadQuery = new Query(client, dbname, "branches", BranchSchema);

            // Format to lowercase
            var list = makeLowerCase([req.params])

            // Remover inventory parameter to prevent false negatives
            var clone = {...list[0]}
            delete clone["inventory"]

            var result = await ReadQuery.read(clone);

            if (result){
                res.send(result)
                return
            } 
        }catch (err){
            console.log(err)
            res.status(500);
            res.send("An internal server error occured");
            return
        }
    }

    if (req.query.inventory){
        try{
            var dbname = req.query.inventory.toLowerCase()
            var ReadQuery = new Query(client, dbname, "branches", BranchSchema);

            // Format to lowercase
            var list = makeLowerCase([req.query])

            // Remover inventory parameter to prevent false negatives
            var clone = {...list[0]}
            delete clone["inventory"]
            var result = await ReadQuery.read(clone);

            if (result){
                res.send(result)
                return
            } 
        }catch (err){
            console.log(err);
            res.status(500);
            res.send("An internal server error occured");
            return
        }
    }


    // No inventory parameter detected
    console.log(err);
    res.status(400);
    res.json({
        error: 400,
        message: "inventory is required"
    })
           
    
}

module.exports = ReadBranch;