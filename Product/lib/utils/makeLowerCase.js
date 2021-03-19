function makeLowerCase(list){
    const newList = list.map((item)=>{
        var clone;
        for (var key in item){
            if (typeof item[key] === "string"){
                item[key] = item[key].toLowerCase()
            }
            
        }
        return item
    })

    return newList
}

//var stuff = {"id": "MB6", "name":"Ring Bit", "category": "Gadgets", "branch": "MB", "price": 250.50}

//console.log(makeLowerCase([stuff]))

module.exports = makeLowerCase;