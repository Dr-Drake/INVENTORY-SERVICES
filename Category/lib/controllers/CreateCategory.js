const {Query, QueryError} = require("../utils/Query");
const CategorySchema = require("../models/CategorySchema.");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

// Post operations
async function CreateCategory(req, res) {
    
    var inv;

    if (req.body.inventory){
        inv = req.body.inventory.toLowerCase()
    }

    if (!req.body.name){
        res.status(400);
        res.json({
            error: 400,
            message: "The category name is required"
        })
        return
    }

    
    try{

        var CategoryQuery = new Query(client, inv, "categories", CategorySchema);

        // Format items to lowercase
        var newItems = makeLowerCase([req.body]);

        // Check if names are already in use
        var check = await CategoryQuery.read(newItems[0]);

        if (check.length > 0){
            res.status(400);
            res.json({
                error: 400,
                message: `The name "${check[0].name}" is already in use`
            })
            return;
        }

        var result = await CategoryQuery.create(newItems);

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
        console.log("Error occured while creating category");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = CreateCategory;