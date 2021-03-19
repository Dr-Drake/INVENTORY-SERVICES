require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http")
const cors = require("cors")
const {client} = require("./mongo_config")


var app = express(); // Express setup

// Mongo setup
const mongoURI = "mongodb://localhost:27017/api";
const mongoConfig = {
    useUnifiedTopology: true,
    useNewUrlParser: true 
}

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

// Middlewares
app.options("/api/accounts/refresh_token", cors(corsOptions));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SIGNATURE));  // Signed cookie
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());


// Routers
const ownerRouter = require("./routes/owner");
const userRouter = require("./routes/user");
const inventoryRouter = require("./routes/inventory");
const confirmationRouter = require("./routes/confirmation");
const refreshRouter = require("./routes/refreshToken");

// Test Routers
//const testRouter = require("./testRouter")
//const testcdbRouter = require("./testCreateDB")
//const testcownRouter = require("./testCreateOwner")

// Mount Routers
app.use("/api/accounts", ownerRouter);
app.use("/api/accounts", userRouter);
app.use("/api/accounts", inventoryRouter);
app.use("/api/accounts", confirmationRouter);
app.use("/api/accounts", refreshRouter);


// Mount Test Routers
//app.use("/", testRouter);
//app.use("/", testcdbRouter);
//app.use("/", testcownRouter);


// Custom Error Handler
app.use((err, req, res, next)=>{
    console.log(err);
    console.log("An unexpected error has occured")
    res.status(500);
    res.send("Internal server error")
})

// Set up HTTP server
const PORT = process.env.PORT || 8080
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


