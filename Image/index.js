require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http")
const {client} = require("./lib/configs/mongo_config")
const {MulterError} = require("multer")
const path = require("path");
const cors = require("cors");


var app = express();  // Express app server

// Middlewares
app.use(cors())
app.use(cookieParser(process.env.COOKIE_SIGNATURE));  // Signed cookie
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "uploads")))


// Api Routers
//const categoryRouter = require("./routes/branches");
const imageTestRouter = require("./routes/image_test")
const imageRouter = require("./routes/images");

// Mount Routers
app.use("/", imageRouter);
app.use("/", imageTestRouter);


// Custome error handler to Handle Multer error
app.use((err, req, res, next)=>{
    if (err instanceof MulterError){
        console.log(err);
        console.log("Multer Error dude")
        res.status(400);
        res.json({
            error: 400,
            message: err.message
        })
    }
})

// Set up HTTP server
const PORT = process.env.PORT || 7579;
const server = http.createServer(app);

// Initialize MongoDB connection once
client.connect((err, result)=>{
    if (!err){
        // Successful connection
        console.log("MongoDB successfully connected")

        // Start the application after the database connection is ready
        server.listen(PORT, 
            () => console.log(`Authentication and User service now listening on port ${PORT}`)
        );
    } else if (err) throw err;
    
})