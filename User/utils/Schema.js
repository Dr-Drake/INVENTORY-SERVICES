var{runValidators} = require("./schemaValidators");
var typeValidator = require("./schemaTypeValidators")

/**
 * @class
 * @classdesc This a class used to build Schemas for MongoDB documents.
 */
class Schema {
    /**
     * @constructor
     * @param {Object} obj - An Object representing the Schema to be used.
     */
    constructor(obj){
        this.obj = this.validateTypes(obj)
    }

    /**
     * @method
     * @param {Object} obj - An Object representing the Schema to be used.
     * @description Validates the Schema Types specified for each parameter
     */
    validateTypes(obj){
        for (var key in obj){
            var isvalid = typeValidator.isValid(obj[key].type)

            if (!isvalid){
                var schemaError = new Error(`${obj[key].type} is not a supported type`)
                schemaError.name = "SchemaError";
                throw schemaError
                return
            }
        }

        return obj
    }


    /**
     * @method
     * @param {Object} doc - An object representing the document to be added to Mongo collection.
     * @description Checks if parameter in document is required, as well as returns a document
     * that uses the specified default value if the parameter was not added or specifed.
     * @returns {Object}
     */
    useDefault(doc){
        for (var key in this.obj){
            if (doc[key] === undefined){

                // First check for default and use default
                if (this.obj[key].default !== undefined){
                    doc[key] = this.obj[key].default
                } 

                // Check if required
                else if (this.obj[key].required){
                    var schemaError = new Error(`${key} is required`)
                    schemaError.name = "SchemaError";
                    throw schemaError
                    return
                }


            }
        }
        return doc
    }

    /**
     * @method
     * @param {Object} doc - An object representing the document to be added to Mongo collection.
     * @description Returns Promise of a validated copy of the document provided.
     * @returns {Promise}
     */
    createValidDoc(doc){
        
        var willValidateDoc = new Promise(async (resolve, reject)=>{
            try{

                var newDoc = this.useDefault(doc)
                for (const key in newDoc){
                    if (!this.obj[key]){
                        var schemaError = new Error(`${key} not specified in Schema`)
                        schemaError.name = "SchemaError";
                        throw schemaError
                        return 
                    }

                    
                    // Throws error if value violates schema specification
                    runValidators(newDoc[key], this.obj[key])
                    
                    // Check for custom validator and run it
                    if (this.obj[key].validator){
                        var valid = this.obj[key].validator(doc[key])
                        if (valid !== true){
                            var schemaError = new Error(`${valid}`)
                            schemaError.name = "SchemaError";
                            throw schemaError
                            return 
                        }
                    }
                    
                }
        
                resolve(newDoc)

            }catch (err){
                reject(err)
            }
            
        })
        
        return willValidateDoc

    }
}

module.exports = Schema