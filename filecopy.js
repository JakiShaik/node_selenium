//setTimeout(delay => { console.log('slept')}, 2000);
//setTimeout(function delay () { console.log('slept again')}, 2000)

var fs = require('fs');
fs.readFile("./file.txt", 'utf8', function onerr(err, txt) { 
    if(err)
    throw err;
    console.log('file content is '+txt);
    fs.writeFile("output.txt", txt, {encoding: 'utf8'}, (err)=> { if(err) throw err;});
 });
