var mustache = require('mustache');
var fs = require ('fs');
var readline = require('readline');
//Example rendering
//var input = { name: "jaki", calc: function() {
     //   return 4+5;
  //}
//};
//var input = { name: "jaki", school: "OSU", state: "OR" };
 //var output = mustache.render("{{name}} is in {{school}} of {{state}}",input);
 //console.log(output);
/* var lineReader = require('line-reader');
 
 lineReader.eachLine('./file.txt', function(line, last) {
   //console.log(line);
   var input = "'"+line+"'"
   console.log('input is '+input);
   var input1 = { name: "jaki", school: "OSU", state: "OR" };
   console.log('input1 is '+input1)
   var output = mustache.render("{{name}} is in {{school}} of {{state}}",input1);
   console.log(output);
   var rndrd = mustache.render("{{name}} is in {{school}} of {{state}}",input);
   console.log(rndrd);
   // do whatever you want with line...
   if(last){
       console.log('last line')
     // or check if it's the last one
   }
 });  */

fs.readFile("./file.txt",'utf8',function (err, txt) {
   console.log('txt is '+txt);
var arr = txt.split('\n')
    console.log(arr[0]);
    if(err) throw err;
     var rndrd = mustache.render("{{name}} is in {{school}} of {{state}}",arr[0]);
     console.log(rndrd);
     fs.writeFile("./output.txt","rndrd is "+rndrd,{encoding:'utf8'},(err) => {
      if(err) throw err;
    }
    )
} )