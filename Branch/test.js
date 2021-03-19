var key = false
var obj = {key}

if (Object.keys(obj).length === 0){
    console.log("yes")
} else{
    console.log("No")
}

var str = "alice-pasqual-Olki5QpHxts-unsplash.jpg";
var extension = str.slice(str.length - 3, str.length)
console.log(extension)

var ProductQuery = require("./lib/models/ProductQuery");
var obj = {
    id: "1555",
    malicious: "Houdini",
    name: "Fatman",
    category: "Sexy",
    bogus: "disaapear",
    branch: "Predator Central"
}
//var Query = new ProductQuery(obj)
//var qobj = Query.buildQuery()

//console.log(qobj)