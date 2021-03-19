/**
 *  This utility folder contains the built in schema validators and related functions
 */

const typeValidator = require("./schemaTypeValidators")

// Our custom error thrown whenever a validation fails
var schemaValidationError = new Error()
schemaValidationError.name = "SchemaValidationError";


// Function to validate Schema type
function validateType(value, schema_property){
    
    if (schema_property.type === String){
        return typeValidator.isString(value)
    }

    if (schema_property.type === Number){
        return typeValidator.isNumber(value) 
    }

    if (schema_property.type === Function){
        return typeValidator.isFunction(value) 
    }

    if (schema_property.type === Array){
        return typeValidator.isArray(value) 
    }

    if (schema_property.type === Boolean){
        return typeValidator.isBoolean(value) 
    }

    if (schema_property.type === Date){
        return typeValidator.isDate(value) 
    }

    if (schema_property.type === Object){
        return typeValidator.isObject(value) 
    }

    if (schema_property.type === Buffer){
        if (!Buffer.isBuffer(value)){
            schemaValidationError.message = `${value} is not of type Number`
            throw schemaValidationError.messa
            return
        }
        return Buffer.isBuffer(value)
    }
}

// Function to validate minimum length
function validateMinLength(value, schema_property){
    if (value < schema_property.minlength){
        schemaValidationError.message = "Minimum length violated"
        throw schemaValidationError
        return
    }

    return true
}


// Function to validate maximum length
function validateMaxLength(value, schema_property){
    if (value > schema_property.maxlength){
        schemaValidationError.message = "Maximum length exceeded"
        throw schemaValidationError
        return
    }

    return true
}



function getSchemaValidator(key){
    switch(key){
        case "type":
            return validateType;
        
        case "minlength":
            return validateMinLength;
        
        case "maxlength":
            return validateMaxLength;
        
        default : null;
    }

}

function runValidators(value, obj){
    for (key in obj){
        var validator = getSchemaValidator(key)
    
        if (validator){
            validator(value, obj)
        }
        
    }
}

module.exports = {
    validateType, 
    validateMaxLength, 
    validateMinLength,  
    getSchemaValidator,
    runValidators,
}
