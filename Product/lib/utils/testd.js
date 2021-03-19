function test({val, cal = "Lol"} = {}) {
    console.log(val)
    console.log(cal)
}

//test();

var arr = [12];

if (arr.length === 0){
    console.log("Yes")
} else{
    console.log("No")
}

console.log(arr instanceof Array)