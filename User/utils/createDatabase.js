var {client} = require("../mongo_config")
//var DatabasCreationError = new Error();

class DatabaseCreationError extends Error{
    constructor(message){
        super(message)

        this.name = "DatabaseCreationError";
    }
}

function createDatabase(dbname){


    const willCreateDatabse = new Promise(async (resolve, reject)=>{
        // Check if database name is a string
        if(typeof dbname !== 'string'){
            reject(new DatabaseCreationError("The inventory parameter should be of type string"))
        }

        // Check database name for white space
        if (dbname.indexOf(" ") >= 0 ){
            reject(new DatabaseCreationError("white space detected in inventory name"))

        }

        // Check if database name is an empty string
        if (dbname.length === 0){
            reject(new DatabaseCreationError("Inventory name should not be an empty string detected"))
        }
        try{
            const newdb = client.db(dbname);  // New Database created

            // Add Collections
            await newdb.createCollection("branches")
            await newdb.createCollection("terminals")
            await newdb.createCollection("products")
            await newdb.createCollection("purchases")
            await newdb.createCollection("categories")
            await newdb.createCollection("images")
        
            resolve({task: "done"})

        } catch(err){
            reject(err)
        }
    })

    return willCreateDatabse;
}

module.exports = {createDatabase, DatabaseCreationError};
