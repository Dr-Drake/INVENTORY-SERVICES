const {Query} = require("../utils/Query");
const ProductSchema = require("../models/ProductSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase")


// Get Operation
async function ReadProduct(req, res) {

    if (req.params.inventory){
        try{
            var dbname = req.params.inventory.toLowerCase()
            var ReadQuery = new Query(client, dbname, "products", ProductSchema);
            var clone = {...req.params}
            delete clone["inventory"]

            // Format to lowercase
            var list = makeLowerCase([clone])
            var result = await ReadQuery.read(list[0]);

            if (result){
                res.send(result)
                return
            } 
        }catch (err){
            res.status(500);
            res.send("An internal server error occured");
            return
        }
    }

    if (req.query.inventory){
        try{
            var dbname = req.query.inventory.toLowerCase()
            var ReadQuery = new Query(client, dbname, "products", ProductSchema);
            var clone = {...req.query}
            delete clone["inventory"]

            // Format to lowercase
            var list = makeLowerCase([clone])
            var result = await ReadQuery.read(list[0]);

            if (result){
                res.send(result)
                return
            } 
        }catch (err){
            res.status(500);
            res.send("An internal server error occured");
            return
        }
    }


    // No inventory parameter detected
    res.status(400);
    res.json({
        error: "message",
        message: "inventory is required"
    })
           
    
}

module.exports = ReadProduct;