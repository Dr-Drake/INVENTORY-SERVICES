const {Query, QueryError} = require("../utils/Query");
const CategorySchema = require("../models/CategorySchema.");
const UpdateCategorySchema = require("../models/UpdateCategorySchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");


// Put operations
async function UpdateCategory(req, res) {
    
    var inv;
    var name;
    var change;

    if (req.body.inventory){
        inv = req.body.inventory.toLowerCase()
    }

    if (typeof req.body.name !== "string"){
        res.status(400);
        res.json({
            error: 400,
            message: "The name parameter shouldd be a string"
        })
    }

    if (typeof req.body.update !== "string"){
        res.status(400);
        res.json({
            error: 400,
            message: "The update parameter shouldd be a string"
        })
    }

    if (req.body.name){
        name = req.body.name.toLowerCase()
    }

    if (req.body.update){
        change = req.body.update.toLowerCase();
    }
    
    if (!name){
        res.status(400);
        res.json({
            error: 400,
            message: "The Category name is required",
        })
        return;
    }

    if (!change){
        res.status(400);
        res.json({
            error: 400,
            message: "The Category update is required",
        })
        return;
    }
    try{
        var UpdateQuery = new Query(client, inv, "categories", CategorySchema, 
        {updateSchema: UpdateCategorySchema});

        // Format to lowercase
        var update = makeLowerCase([req.body])

        // Prepare the update
        var clone = {...update[0]}
        clone["name"] = change  // Replace name with the updated name
        delete clone["update"]    // Remove update parameter to avoid Validation Errors.

        var filter = {
            name: name
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
        console.log("Error occured while updating category");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = UpdateCategory;