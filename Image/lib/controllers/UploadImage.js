var {client} = require("../configs/mongo_config")
var {Query, QueryError} = require("../utils/Query")
var ImageSchema = require("../models/ImageSchema");
var {host} = require("../configs/image_config")
var {ValidationError} = require("joi")

async function UploadImage(req, res){
    var inv;

    if (req.headers["x-inventory"]){
        inv = req.headers["x-inventory"].toLowerCase()
    }

    // Ensure that files were also sent
    if (!req.files){
        res.status(400);
        res.json({
            error: 400,
            message: "No files were sent"
        })
        return
    }

    try{
        var uploadQuery = new Query(client, inv, "images", ImageSchema);
        
        // Format files into a list of objects
        var arr = req.files.map((file)=>{
            return {
                name: file.originalname,
                url: host + "/" + inv + "_" + file.originalname
            }
        })

        var filter = [];
        for (i = 0; i < arr.length; i++){
            var f = arr[i];
            var query = {
                name: f.name
            }

            var response = await uploadQuery.read(query);

            if (response.length > 0){
                res.status(400);
                res.json({
                    error: 400,
                    message: `An image with this name "${f.name} already exists"`
                })
                return;
                
            }
        }
        var result = await uploadQuery.create(arr)

        if (result){
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
        console.log("An Error occurred while uploading images")
        res.status(500);
        res.send("An internal server error occured");
    }
}

module.exports = UploadImage