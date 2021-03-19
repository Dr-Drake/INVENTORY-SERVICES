const {Query, QueryError} = require("../utils/Query");
const CategorySchema = require("../models/CategorySchema.");
const UpdateCategorySchema = require("../models/UpdateCategorySchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

// Post operations
async function DeleteCategory(req, res) {
    
    var inv;

    if (req.body.inventory){
        inv = req.body.inventory.toLowerCase()
    }

    if (!req.body.categories){
        res.status(400);
        res.json({
            error: 400,
            message: "The categories parameter is required"
        })
        return
    }

    // Items should be an array
    if (!(req.body.categories instanceof Array)){
        res.status(400);
        res.json({
            error: 400,
            message: "The categories parameter is should be an array"
        })
        return
    }
    

    try{
        var DeleteQuery = new Query(client, inv, "categories", CategorySchema);

        var list = req.body.categories;

        // Check if items in the array are strings
        for (i = 0; i < list.length; i++){
            if (typeof list[i] !== "string"){
                res.status(400);
                res.json({
                    error: 400,
                    message: "Items in the array must be the category names - a string"
                })
                return
            }
        }

         // Format to lowercase
        var deleteArray = list.map((item)=>{
            return item.toLowerCase()
        })
        
        var deleteFilter = {name: {$in: deleteArray}};
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
        console.log("Error occured while deleting category");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = DeleteCategory;