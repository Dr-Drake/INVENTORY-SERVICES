const {Query, QueryError} = require("../utils/Query");
const BranchSchema = require("../models/BranchSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

// Post operations
async function CreateBranch(req, res) {
    
    var inv;

    if (req.body.inventory){
        inv = req.body.inventory.toLowerCase()
    }
    
    try{

        var BranchQuery = new Query(client, inv, "branches", BranchSchema);

        // Removes inventory parameter to prevent Validation Error
        var clone = {...req.body}
        delete clone["inventory"];

        // Format items to lowercase
        var newItems = makeLowerCase([clone]);

        // Removes inventory parameter to prevent Validation Error
        

        var result = await BranchQuery.create(newItems);

        if (result){
            res.json({
                message: "success",
                result: result.result,
            })
            return
        }
    }catch(err){

        // We expect a QueryError or a Validation Error
        if (err instanceof QueryError || err instanceof ValidationError){
            console.log(err);
            res.status(400);
            res.json({
                error: 400,
                message: err.message
            })
            return
        }

        // We also expect a BulkwriteError for duplicate keys
        if (err.name === "BulkWriteError"){
            console.log(err)
            res.status(400);
            res.json({
                error: 400,
                message: err.message
            })
            return
        }

        // For the unexpected errors
        console.log(err);
        console.log("Error occured while creating branch");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = CreateBranch;