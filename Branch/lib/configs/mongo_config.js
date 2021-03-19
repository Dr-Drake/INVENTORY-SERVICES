const {MongoClient} = require("mongodb");

// Mongo setup
const mongoURI = process.env.MONGO_URL || "mongodb://localhost:27017"
const mongoConfig = {
    useUnifiedTopology: true,
    useNewUrlParser: true 
}
// Create a new MongoClient
const client = new MongoClient(mongoURI,mongoConfig);

module.exports = {client};