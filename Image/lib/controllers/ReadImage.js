var {client} = require("../configs/mongo_config")
var {Query, QueryError} = require("../utils/Query")
var ImageSchema = require("../models/ImageSchema");
var {host} = require("../configs/image_config")
var {ValidationError} = require("joi");

async function ReadImage(req, res){
    var inv;
    var query;

    if (req.headers["x-inventory"]){
        inv = req.headers["x-inventory"].toLowerCase()
    }

    if (req.params.inventory){
        inv = req.params.inventory.toLowerCase()
        query = req.params
    }

    if (req.query.inventory){
        inv = req.query.inventory.toLowerCase()
        query = req.query
    }


    try{
        var uploadQuery = new Query(client, inv, "images", ImageSchema);
        var projection = {
            _id: 0
        }
        var clone = {...query}
        delete clone["inventory"]  // To prevent false negatives
        console.log(query)

        var result = await uploadQuery.read(clone, projection)

        if (result){
           res.send(result)
           return
        }
    } catch(err){

        // Maybe a Validation or QueryError could arise
        if (err instanceof QueryError || err instanceof ValidationError){
            res.status(400);
            res.json({
                error: 400,
                message: err.message
            })
            return
        }


        // For the unexpecetd errors
        console.log(err);
        console.log("An Error occurred while reading images")
        res.status(500);
        res.send("An internal server error occured");
    }
}

module.exports = ReadImage;