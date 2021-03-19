const {Query, QueryError} = require("../utils/Query");
const ImageSchema = require("../models/ImageSchema");
const UpdateImageSchema = require("../models/UpdateImageSchema");
var {client} = require("../configs/mongo_config");
var {ValidationError} = require("joi");
var fs = require("fs")
var {filePath} = require("../configs/image_config");

// Post operations
async function DeleteImage(req, res) {
    
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
        var DeleteQuery = new Query(client, inv, "images", ImageSchema);

        var list = req.body.items;
        
        // Check if items in the array are strings
        for (i = 0; i < list.length; i++){
            if (typeof list[i] !== "string"){
                res.status(400);
                res.json({
                    error: 400,
                    message: "Items in the array must be the image names - a string"
                })
                return
                //break;
            }
        }

        // Verify if each file exists for the inventory
        for (i = 0; i < list.length; i++){
            
            var search = {
                name: list[i]
            }
            var findResult = await DeleteQuery.read(search);

            if (findResult.length === 0){
                res.status(400);
                res.json({
                    error: 400,
                    message: `${list[i]} was not found.`
                })
                return

            }
        }

        // Remove files from upload folder
        for (i = 0; i < list.length; i++){
            var fpath = filePath + "/" + inv + "_" + list[i]
            fs.unlink(fpath, async(err)=>{

                if (!err){
                    var deleteFilter = {name: {$in: list}};
                    var result = await DeleteQuery.delete(deleteFilter);

                    if (result){
                        res.json({
                            message: "success",
                            result: result.result,
                        })
                        return
                    }
                }
                console.log(err);
                console.log("Error occured while deleting images from file system");
                res.status(400);
                res.json({
                    error: 400,
                    message: "No file with that name exists"
                })
                
            })
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
        console.log("Error occured while deleting images");
        res.status(500);
        res.send("An internal server error occured");
    }
    
}

module.exports = DeleteImage;