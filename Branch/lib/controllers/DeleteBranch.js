const {Query, QueryError} = require("../utils/Query");
const BranchSchema = require("../models/BranchSchema");
const UpdateBranchSchema = require("../models/UpdateBranchSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

// Delete operations
async function DeleteBranch(req, res) {
    
    var inv;
    var id;

    if (req.params.inventory){
        inv = req.params.inventory.toLowerCase()
    }

    if (req.query.inventory){
        inv = req.query.inventory.toLowerCase()
    }

    if (req.params.id){
        id = req.params.id.toLowerCase()
    }

    if (req.query.id){
        id = req.query.id.toLowerCase()
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
        var DeleteQuery = new Query(client, inv, "branches", BranchSchema);
        var deleteFilter = {_id: {$eq: id}};
        var result = await DeleteQuery.delete(deleteFilter);

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
        console.log("Error occured while deleting a branch");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = DeleteBranch;