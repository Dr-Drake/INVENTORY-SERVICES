const {Query, QueryError} = require("../utils/Query");
const ProductSchema = require("../models/ProductSchema");
const UpdateProductSchema = require("../models/UpdateProductSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");

// Put operations
async function UpdateProduct(req, res) {
    
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
            message: "The Product id is required",
        })
        return;
    }
    try{
        var UpdateQuery = new Query(client, inv, "products", ProductSchema, 
        {updateSchema: UpdateProductSchema});

        var clone = {...req.body}
        delete clone["inventory"]

        // Format to lowercase
        var update = makeLowerCase([clone])
        var filter = {
            _id: id
        }
        var result = await UpdateQuery.update(filter, update[0]);

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
        console.log("Error occured while updating product");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = UpdateProduct;