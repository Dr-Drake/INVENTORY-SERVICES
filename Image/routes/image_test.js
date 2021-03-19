var express = require("express");
var path = require("path")
var api = express.Router();
var multer = require("multer");
const { join } = require("path");


var abspath = path.join(__dirname, "../uploads")
var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, abspath);
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    }
})
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 6 * 1024 * 1024  // 6MB
    }
});

api.post("/api/image", upload.any(), async (req, res)=>{
    console.log(req.body)
    var arr = req.files.map((file)=>{
        return {
            name: file.originalname,
            url: req.hostname + ":7579/" + file.originalname
        }
    })

    res.send(arr)
})

module.exports = api;