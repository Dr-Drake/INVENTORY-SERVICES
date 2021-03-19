var {client} = require("../configs/mongo_config")
var {Query, QueryError} = require("../utils/Query")
var ImageSchema = require("../models/ImageSchema");
var UpdateImageSchema = require("../models/UpdateImageSchema");
var {host, filePath} = require("../configs/image_config")
var {ValidationError} = require("joi");
var fs = require("fs");

async function UpdateImage(req, res){
    var inv;
    var name;
    var update;

    if (req.headers["x-inventory"]){
        inv = req.headers["x-inventory"].toLowerCase()
    }

    if (req.body.inventory){
        inv = req.body.inventory.toLowerCase()
    }

    if (req.body.name){
        name = req.body.name
    }

    if (req.body.update){
        update = req.body.update
    }

    if (!name){
        res.status(400);
        res.json({
            error: 400,
            message: "The name of the image being edited is required"
        })
        return;
    }

    if (!update){
        res.status(400);
        res.json({
            error: 400,
            message: "The updated name of the image being edited is required"
        })
        return;
    }


    try{
        var UpdateQuery = new Query(client, inv, "images", ImageSchema, 
        {updateSchema: UpdateImageSchema});

        var filter = {
            name: name
        }
        
        var update1 = {
            name: update,
            url: host + "/" + inv + "_" + update
        }

        var result = await UpdateQuery.update(filter, update1);

        if (result.result.nModified > 0){

            var oldpath = filePath + "/" + inv + "_" + name
            var newpath = filePath + "/" + inv + "_" + update
            console.log(newpath)

            // Rename the file
            fs.rename(oldpath, newpath, ()=>{
                res.json({
                    message: "success",
                    result: result.result
                })
                return
            })
           
        }else{
            res.json({
                message: "success",
                result: result.result
            })
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
        console.log("An Error occurred while updating image")
        res.status(500);
        res.send("An internal server error occured");
    }
}

module.exports = UpdateImage;