var {client} = require("../mongo_config");

function getCollections(dbname){

    const willGetCollection = new Promise((async (resolve, reject)=>{
        try{
            const db = client.db(dbname);
            const collections = await db.listCollections({}, {nameOnly: true}).toArray()
            
            if (collections){
                resolve(collections)
            }

        } catch(err){
            reject(err)
        }
    }))

    return willGetCollection;
}

module.exports = getCollections;