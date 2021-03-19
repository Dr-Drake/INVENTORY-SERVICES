const {Query, QueryError} = require("../utils/Query");
const ProductSchema = require("../models/ProductSchema");
const UpdateProductSchema = require("../models/UpdateProductSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

// Post operations
async function DeleteProduct(req, res) {
    
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
        return
    }

    // Items should be an array
    if (!(req.body.items instanceof Array)){
        res.status(400);
        res.json({
            error: 400,
            message: "The items parameter is should be an array"
        })
        return
    }
    

    try{
        var DeleteQuery = new Query(client, inv, "products", ProductSchema);

        var list = req.body.items;
        
        // Check if items in the array are strings
        for (i = 0; i < list.length; i++){
            if (typeof list[i] !== "string"){
                res.status(400);
                res.json({
                    error: 400,
                    message: "Items in the array must be the product Ids - a string"
                })
                return
                //break;
            }
        }

        // Format to lowercase
        var deleteArray = list.map((item)=>{
            return item.toLowerCase()
        })
        
        var deleteFilter = {_id: {$in: deleteArray}};
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
        console.log("Error occured while deleting product");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = DeleteProduct;