/**
 *  Contains functions for validating Supported BSON data types
 */

// Our custom error thrown whenever a validation fails
var schemaTypeValidationError = new Error()
schemaTypeValidationError.name = "SchemaTypeValidationError";

const supportedTypes = [String, Number, Array, Function, Object, Boolean, Date, Buffer]

// Returns if value is a supported type
function isValid (value){
    return supportedTypes.includes(value)
}

// Returns if a value is a string
function isString (value) {
    if(typeof value === 'string' || value instanceof String){
        return true
    }
    schemaTypeValidationError.message = `${value} is not of type String`
    throw schemaTypeValidationError
    return
}

// Returns if a value is really a number
function isNumber (value) {
    if(typeof value === 'number' && isFinite(value)){
        return true;
    }
    schemaTypeValidationError.message = `${value} is not of type Number`
    throw schemaTypeValidationError
    return
    
}

// Returns if a value is an array
function isArray (value) {
    if(value && typeof value === 'object' && value.constructor === Array){
        return true;
    }
    schemaTypeValidationError.message = `${value} is not of type Array`
    throw schemaTypeValidationError
    return
   
}

// Returns if a value is a function
function isFunction (value) {
    if(typeof value === 'function'){
        return true;
    }
    schemaTypeValidationError.message = `${value} is not of type Function`
    throw schemaTypeValidationError
    return
}

// Returns if a value is an object
function isObject (value) {
    if(value && typeof value === 'object' && value.constructor === Object){
        return true;
    }
    schemaTypeValidationError.message = `${value} is not of type Object`
    throw schemaTypeValidationError
    return
}

// Returns if a value is a boolean
function isBoolean (value) {
    if(typeof value === 'boolean'){
        return true; 
    }
    schemaTypeValidationError.message = `${value} is not of type Boolean`
    throw schemaTypeValidationError
    return
}

// Returns if value is a date object
function isDate (value) {
    if(value instanceof Date){
        return true
    }
    schemaTypeValidationError.message = `${value} is not of type Date`
    throw schemaTypeValidationError
    return
}

module.exports = {
    isValid,
    isString,
    isNumber,
    isFunction,
    isObject,
    isArray,
    isBoolean,
    isDate
}


