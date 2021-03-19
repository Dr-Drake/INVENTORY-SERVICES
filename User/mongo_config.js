const {MongoClient} = require("mongodb");


// Mongo setup
const mongoURI = "mongodb+srv://Drake:Fintech123@cluster0-iebwm.mongodb.net/test?retryWrites=true&w=majority";
//var mongoURI = "mongodb://Drake:Fintech123@cluster0-shard-00-00.iebwm.mongodb.net:27017,cluster0-shard-00-01.iebwm.mongodb.net:27017,cluster0-shard-00-02.iebwm.mongodb.net:27017/oauth?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
const mongoConfig = {
    useUnifiedTopology: true,
    useNewUrlParser: true 
}
// Create a new MongoClient
const client = new MongoClient(mongoURI,mongoConfig);
async function start(){
  try{
    await client.connect()
  } catch(err){
    //console.log(err)
    console.log("Error encountered while trying to connect")
  }
}

async function run() {
    try {
      // Connect the client to the server
      await client.connect();
  
      // Establish and verify connection
      await client.db("admin").command({ ping: 1 });
      console.log("Connected successfully to server");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}
//run().catch(console.dir);

module.exports = {client};