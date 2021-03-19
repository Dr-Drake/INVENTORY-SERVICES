require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http")
const {client} = require("./lib/configs/mongo_config")
const cors = require("cors");


var app = express();  // Express app server

// Middlewares
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SIGNATURE));  // Signed cookie
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());


// Test Routers
const testRouter = require("./testRouter")

// Api Routers
const productRouter = require("./routes/products");

// Mount Routers
app.use("/", testRouter); // Test
app.use("/api", productRouter);

// Set up HTTP server
const PORT = process.env.PORT || 7576
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