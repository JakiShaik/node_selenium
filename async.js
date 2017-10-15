var async = require('async');
var fs = require('fs');

var items = ['rice', 'chicken', 'curd', 'dessert'];
async.each(items, function (item, callback) {
    fs.writeFile(item+".txt","Your content is " +item + "\n", {encoding: 'utf8'}, (err) => {
        if (err) throw err;
        else callback();
    })
}, function() {
    console.log('all items are written');
} ); 