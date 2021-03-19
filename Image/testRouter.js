var express = require("express");

var api = express.Router();
var multer = require("multer");
var upload = multer({
    limits: 1 * 1024 * 1024
});

api.post("/test/:id/:book", upload.any(), async (req, res)=>{
    try{
        console.log(req.body.name)
        console.log(req.params.id)
        console.log(req.params.book)
        var arr = req.files.map((file)=>{
            return file.originalname
        })
        res.json({
            message: "Received",
            files: arr
        })
    } catch(err){
        console.log("Unknown error")
        res.sendStatus(500);
    }
})

module.exports = api;