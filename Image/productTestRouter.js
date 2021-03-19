var express = require("express");

var api = express.Router();
var multer = require("multer");
var upload = multer({
    limits: 1 * 1024 * 1024
});

var ProductQuery = require("./lib/models/ProductQuery");
var ProductSchema = require("./lib/models/ProductSchema");

api.post("/product/:id", async (req, res)=>{
    try{
        console.log(req.file.buffer)
        res.json({
            message: "Received",
            size: req.file.size,
        })
    } catch(err){
        console.log("Unknown error")
        res.sendStatus(500);
    }
})

module.exports = api;