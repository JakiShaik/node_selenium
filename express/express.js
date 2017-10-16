var express = require('express');

var app = express();
app.use(function(req,res) {
    res.write('Hello freaking world \n');
//app.use(function(req,res) {
var date = new Date();    
var hour = date.getHours();
console.log('hours is '+hour); 
hour = (hour < 10 ? "0" : "") + hour;
var min  = date.getMinutes();
console.log('hours is '+min);
min = (min < 10 ? "0" : "") + min;
var sec  = date.getSeconds();
console.log('hours is '+sec);
sec = (sec < 10 ? "0" : "") + sec;
var year = date.getFullYear();
var month = date.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;
var day  = date.getDate();
day = (day < 10 ? "0" : "") + day;
res.write('timestamp is \n')
res.end(year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec);
});
app.listen(3000);