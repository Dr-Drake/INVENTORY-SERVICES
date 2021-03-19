const {Query, QueryError} = require("../utils/Query");
const BranchSchema = require("../models/BranchSchema");
const UpdateBranchSchema = require("../models/UpdateBranchSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");


// Put operations
async function UpdateBranch(req, res) {
    
    var inv;
    var id;

    if (req.body.inventory){
        inv = req.body.inventory.toLowerCase()
    }

    if (req.body.id){
        id = req.body.id.toLowerCase()
    }

    if (!id){
        res.status(400);
        res.json({
            error: 400,
            message: "The branch id is required"
        })
        return
    }


    try{
        var UpdateQuery = new Query(client, inv, "branches", BranchSchema, 
        {updateSchema: UpdateBranchSchema});

        // Format to lowercase
        var update = makeLowerCase([req.body])

        // Prepare the update
        var clone = {...update[0]}
        delete clone["inventory"]    // Remove inventory parameter to avoid Validation Errors.

        var filter = {
            _id: id
        }
        var result = await UpdateQuery.update(filter, clone);

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

        // For the unexpected errors
        console.log(err);
        console.log("Error occured while updateing branch");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = UpdateBranch;