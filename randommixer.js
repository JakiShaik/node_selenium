var fs = require('fs')
fs.readFile("./fruits_file.txt", 'utf8', function (err,txt) {
    if(err) {
    throw err;
    }
    //console.log("txt is "+txt)
    arr = txt.split("\n")
    //console.log(arr.length);
     if(arr [arr.length - 1] === '' ) {
        arr.pop(arr [arr.length - 1] )
    }
    //console.log(arr)
    if(arr.length % 2 === 1 ) {
        arr.push("(empty)");
    }
    arr.sort();
    //console.log(arr)
    for (var i =0; i < arr.length - 1; i++) {
        console.log(arr[i] + "\t" + arr[i +1]);
        i++;
    }
    //console.log("arr is "+arr);
    //fs.writeFile("./output.txt", txt, {encoding:'utf8'}, (err)=> {if (err) throw err;});
    //console.log('fruits are:'+txt)
});
