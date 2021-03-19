var {filePath} = require("../configs/image_config");
var multer = require("multer");


var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, filePath);
    },
    filename: (req, file, cb)=>{
        cb(null, req.headers["x-inventory"].toLowerCase() + "_" + file.originalname);
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 6 * 1024 * 1024  // 6MB
    }
});

module.exports = upload;
