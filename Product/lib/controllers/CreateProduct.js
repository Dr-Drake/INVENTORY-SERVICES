const {Query, QueryError} = require("../utils/Query");
const ProductSchema = require("../models/ProductSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

// Post operations
async function CreateProduct(req, res) {
    
    var inv;

    if (req.body.inventory){
        inv = req.body.inventory.toLowerCase()
    }

    if (!req.body.items){
        res.status(400);
        res.json({
            error: 400,
            message: "The items parameter is required"
        })
    }
    
    try{
        var CreateQuery = new Query(client, inv, "products", ProductSchema);

        // Format items to lowercase
        var newItems = makeLowerCase(req.body.items);
        var result = await CreateQuery.create(newItems);

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
        console.log("Error occured while creating product");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = CreateProduct;