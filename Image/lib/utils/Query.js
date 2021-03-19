const Joi = require("joi");
const {MongoClient} = require("mongodb");


class QueryError extends Error{
    constructor(message){
        super(message);

        this.name = "QueryError"
    }
}

class Query{

    /**
     * @constructor
     * @param {MongoClient} client 
     * @param {String} dbname 
     * @param {String} collection 
     * @param {Object} schema 
     */
    constructor(client, dbname, collection, schema, {updateSchema}={}){
        this.state = {
            client: this.validateClient(client),
            dbname: this.validateInput(dbname, "The name of the MongoDB databse is required in 2nd arg"),
            collection: this.validateInput(collection, "The name of the MongoDB collection is required in 3rd arg"),
            schema: this.validateSchema(schema)
        }
        this.updateSchema = updateSchema

    }

    validateInput(value, message){

        if (value){
            return value
        }

        throw new QueryError(message)
    }

    validateClient(value){
        if (value && value instanceof MongoClient){
            return value
        }

        throw new QueryError(`${value} is not an instance of MongoClient`)
    }

    validateSchema(value){
        if (Joi.isSchema(value)){
            return value
        }
        throw new QueryError(`${value} is not a joi schema`)
    }


    buildQuery(payload){
        var qobj = {...payload};  // clone

        for (var key in payload){
            if (payload[key] && key === "id"){
                qobj["_id"] = payload[key]
                delete qobj[key]
            }
        }

        return qobj;
    }

    /**
     * @method
     * @param {Object} doc 
     */
    read(doc, projection = null){

        const willGet = new Promise(async (resolve, reject)=>{
            try{

                // Get Product from database
                var {client, dbname, collection} = this.state
                var db = client.db(dbname)  // Database
                var dcollection = db.collection(collection)  // collection
                var query = this.buildQuery(doc)

                if (projection){
                    var options = {projection: projection}
                    var result = await dcollection.find(query, options).toArray();

                    if (result){
                        resolve(result)
                    }
                }
                var result = await dcollection.find(query).toArray();

                if (result){
                    resolve(result)
                }

            } catch (err){
                console.log(`Error occured while getting ${collection} from database`)
                reject(err)
            }
        })

        return willGet;

    }

    /**
     * @method
     * @param {Array} docArray 
     */
    create(docArray){

        if (!docArray || !(docArray.constructor === Array)) {
            throw new QueryError(`${docArray} is not of type Array`)
        }

        if (docArray.length === 0) {
            throw new QueryError(`${docArray} is an empty array`)
        }
        
        const willCreate = new Promise(async (resolve, reject)=>{
            try{
                // Put Product in database
                var {client, dbname, schema, collection} = this.state
                var db = client.db(dbname)  // Database
                var dcollection = db.collection(collection)  // collection

                // Build appropriate query
                var newDocArray = docArray.map((doc)=>{
                    return this.buildQuery(doc)
                })

                // Validate the documents in the array
                var validArray = newDocArray.map(async (doc)=>{
                    var value = await schema.validateAsync(doc)

                    if (value){
                        return value
                    }
                })
                
                // Resolve all the pending promises in validArray
                var finalArray = await Promise.all(validArray);

                if (finalArray){
                    const result = await dcollection.insert(finalArray)

                    if (result){
                        resolve(result)
                    }
                }
            } catch(err){
                console.log(`Error occured while inserting document into ${collection} collection`)
                reject(err)
            }
        })

        return willCreate;
    }


    update(filter, update){
        const willUpdate = new Promise(async(resolve, reject)=>{

            try{
                var {client, dbname, schema, collection} = this.state
                var db = client.db(dbname)  // Database
                var dcollection = db.collection(collection)  // collection

                // Build appropriate filter and update
                var newFilter = this.buildQuery(filter);
                var newUpdate = this.buildQuery(update);
                
                // If updateSchema, use validate update via the schema
                if (this.updateSchema){
                    var validUpdate = await this.updateSchema.validateAsync(newUpdate)

                    if (validUpdate){
                        var result = await dcollection.updateOne(
                            newFilter, 
                            {$set: validUpdate}, 
                            {upsert: false}
                        );
    
                        if (result){
                            resolve(result)
                        }
                    }

                    return
                }

                // Update without validation
                var result = await dcollection.updateOne(
                    newFilter, 
                    {$set: newUpdate}, 
                    {upsert: false}
                );

                if (result){
                    resolve(result)
                }
               

            }catch(err){
                console.log(`Error occured while updating the ${collection} collection`)
                reject(err)
            }
        })

        return willUpdate;
    }


    /**
     * @method
     * @param {Object} filter
     */
    delete(filter = null){

        const willDelete = new Promise(async(resolve, reject)=>{
            try{
                var {client, dbname, schema, collection} = this.state
                var db = client.db(dbname)  // Database
                var dcollection = db.collection(collection)  // collection

                var result = await dcollection.deleteMany(filter)  

                if (result){
                    resolve(result)
                }

               
            }catch(err){
                console.log(`Error occured while deleting item(s) from ${collection} collection`)
                reject(err)
            }
        })

        return willDelete;
    }

}

module.exports = {Query, QueryError};