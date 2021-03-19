const getCollections = require("./utils/getCollections");
var {client} = require("./mongo_config");

async function run(){
    try{
        await client.connect()
        const result = await getCollections("Hubmart");

        if (result){
            console.log(result);
            
        }
    } catch(err){
        console.log(err)
    } finally{
        await client.close()
    }
}

//run();
var str = "Local "
var str2 = new String("Mason")
console.log((str instanceof String) === false)
if(typeof str !== 'string' ||(str instanceof String) === false){
    console.log("Not a string")
} else{
    console.log("A string")
}

var arr = {}
if (arr){
    console.log("Object")
} else{
    console.log("Not object")
}

