require('dotenv').config();
var {Query, QueryError} = require("./Query")
var {client} = require("../configs/mongo_config");
const { response } = require('express');
const Joi = require("joi")
const customSchema = Joi.object({
    _id: Joi.string().alphanum().required(),
    name: Joi.string().alphanum(),
    status: Joi.string()
})

const updateSchema = Joi.object({
    _id: Joi.string().alphanum(),
    name: Joi.string().alphanum(),
    status: Joi.string()
})

var testQuery = new Query(client, "test", "people", customSchema, {updateSchema: updateSchema});
var doc = {
    _id: "1002",
    name: "Fake",
    status: "Filthy Poor Retard"
}

var doc3 = {
    id: "1001",
    name: "Drake",
    status: "Filthy Rich Genius"
}

var doc2 = {
    accountType: "current"
}

var filter = {
    id: "1002"
}

var deleteFilter = ["1000"];

var update = {
    status: "Fatnician"
}


client.connect(async (err, result)=>{

    if (err) throw err;

    try{
        const response = await testQuery.update(filter, update);

        if (response){
            console.log(response.result)
        }
    }catch (err){
        console.log(err)
    } finally{
        await client.close()
    }

})

/*testQuery.read(doc).then((response)=>{
    console.log(response);
}).catch((err)=>{
    console.log(err)
})*/


