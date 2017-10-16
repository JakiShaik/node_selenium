var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.contentType('text/html');
    res.write("<a href='/poem?id=1'>see Poem1</a> \n");
    res.write("<a href='/poem?id=2'>see poem2</a> \n");
    res.end("<a href='/poem?id=3'>see Poem3</a> \n");
    });
    //switch (req.url) {
        //case '/poem1/': 
            app.get('/poem',function(req,res) {
                //console.log("URL param firstname is: "+req.query.firstname);
                var url = req.param('id');
                res.send('poem'+url);
            });
      //      break;
    //    case '/poem2/':
            /*app.get('/poem2',function(req,res) {
                res.end('poem2');
            });   
  //          break;
        //case '/poem3/':
            app.get('/poem3',function(req,res) {
                res.end('poem3');
             });
          //  break;    
//}
    /*app.get('/poem1', function(req, res) {
    res.contentType('text/html');
    res.end("Hello, MSSWI! Click my button! "
    + "<form method=post><input type=submit></form>");
    });
    app.post('/msswi', function(req, res) {
    res.contentType('text/html');
    res.end("Thanks for posting to me!");
    })*/
    app.listen(3000);