const {Query} = require("../utils/Query");
const CategorySchema = require("../models/CategorySchema.");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var makeLowerCase = require("../utils/makeLowerCase");
var decode = require("urldecode");


// Get Operation
async function ReadCategory(req, res) {

    if (req.params.inventory){
        console.log(req.params)
        try{
            var dbname = req.params.inventory.toLowerCase()
            var ReadQuery = new Query(client, dbname, "categories", CategorySchema);

            // Format to lowercase
            var list = makeLowerCase([req.params])
            var result = await ReadQuery.read(list[0]);

            if (result){
                res.send(result)
                return
            } 
        }catch (err){
            console.log(err)
            res.status(500);
            res.send("An internal server error occured");
            return
        }
    }

    if (req.query.inventory){
        try{
            var dbname = req.query.inventory.toLowerCase()
            var ReadQuery = new Query(client, dbname, "categories", CategorySchema);

            // Format to lowercase
            var list = makeLowerCase([req.query])
            var result = await ReadQuery.read(list[0]);

            if (result){
                res.send(result)
                return
            } 
        }catch (err){
            console.log(err);
            res.status(500);
            res.send("An internal server error occured");
            return
        }
    }


    // No inventory parameter detected
    console.log(err);
    res.status(400);
    res.json({
        error: 400,
        message: "inventory is required"
    })
           
    
}

module.exports = ReadCategory;