var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var archiver = require('archiver');
var async = require('async');

var CFG = {};
process.argv.forEach(function (arg) {
    var eqloc = arg.indexOf('=');
    if (eqloc != -1) {
        var nm = arg.substring(0, eqloc);
        console.log('nm is '+ nm);
        var vl = arg.substring(eqloc + 1);
        console.log('vl is '+vl);
        CFG[nm] = vl;
    }
});

var ROOT_DIR = CFG.ROOT;
var TEMP_DIR = CFG.TEMP ? CFG.TEMP : "/tmp";
var DEST_DIR = CFG.DEST ? CFG.DEST : "/Users/VirajithaKarnatapu/Documents/destdir";
var PASSWORD = CFG.PASS;

if (!ROOT_DIR || !PASSWORD) {
    console.log("Usage: node backup.js ROOT=c:\\whatever PASS=yourpassword [TEMP=c:\\temp] [DEST=\\\\back\\up\\to\\this\\path] ");
    process.exit(-1);
}

findAllSubdirs(ROOT_DIR, function (dirs) {
    // eachSeries means we only recurse into directories one at a time (not in parallel)
    async.eachSeries(dirs, function (dir, callback) {
        getAllFiles(dir, function (files) {
            console.log(dir);
            // each means we can back up the files of a given directory in parallel
            async.each(files, function (file, callback) {
                backupFile(file, callback);
            });
            callback();
        });
    });
});
function findAllSubdirs(rootdir, callback) {
    var rv = [];

    appendToRv(rootdir, function () {
        rv.sort();
        callback(rv);
    });
    //console.log(rv);
    function appendToRv(dir, callback) {
        rv.push(dir);
        fs.readdir(dir, function (err, entries) {
            if (err) throw err;
            async.each(entries, function (entry, callback) {
                var entryPath = path.join(dir, entry);
                fs.stat(entryPath, function (err, entryInfo) {
                    if (err) throw err;
                    if (entryInfo.isDirectory()) {
                        appendToRv(entryPath, callback);
                    } else {
                        callback();
                    }
                });
            }, callback);
        });
    }
}
function getAllFiles(dir, callback) {
    var rv = [];
    fs.readdir(dir, function (err, entries) {
        if (err) throw err;
        async.each(entries, function (entry, callback) {
            var entryPath = path.join(dir, entry);
            fs.stat(entryPath, function (err, entryInfo) {
                if (err) throw err;
                if (entryInfo.isFile()) {
                    rv.push(entryPath);
                }
                callback();
            });
        }, function () {
            callback(rv);
        });
    });
}
function backupFile(file, callback) {
    var filename = path.basename(file);
    var filepath = path.dirname(file);
    var cleanFilename = escapeFSpath(filename);
    var cleanFilepath = escapeFSpath(filepath);
    var rnd = Math.round(Math.random() * 100000);
    var zipfile = path.join(TEMP_DIR, rnd + cleanFilename + ".zip");
    var encfile = path.join(TEMP_DIR, rnd + cleanFilename + ".enc");

    var dstdir = path.join(DEST_DIR, cleanFilepath);
    var dstfile = path.join(dstdir, cleanFilename);

    fs.stat(file, function (srcError, srcInfo) {
        fs.stat(dstfile, function (dstError, dstInfo) {
            if (srcError) throw err;
            var doCopy = true;
            if (dstError == null && dstInfo.isFile() && dstInfo.mtime >= srcInfo.mtime)
                doCopy = false;

            if (doCopy) {
                console.log(" " + file);

                compressFile(filepath, zipfile, filename, function () {
                    console.log("  >" + zipfile);
                    encryptFile(zipfile, encfile, PASSWORD, function () {
                        console.log("   >" + encfile);
                        fs.mkdir(dstdir, function (err) {
                            copyFile(encfile, dstfile, function () {
                                console.log("    >" + dstfile);
                                fs.unlink(zipfile, function () {
                                    fs.unlink(encfile, function () {
                                        callback();
                                    });
                                });
                            });
                        });
                    });
                });
            } else {
                console.log(" (" + file + ")");
                callback();
            }
        });
    });

}
function escapeFSpath(path) {
    return path.replace(/#/g, "#0").replace(/\//g, "#1").replace(/\\/g, "#2").replace(/\./g, "#3").replace(/:/g, "#4")
}

/// Compresses a file and outputs zipped file to the specified file path; 
//  The file within the zip file will have the name you give (labelAs)
//  Calls callback() on success, throws err on error.
function compressFile(inputPath, outputPath, labelAs, callback) {
    var output = fs.createWriteStream(outputPath, { autoClose: true });
    var zipArchive = archiver('zip');
    output.on('close', function () {
        if (callback) callback();
    });
    zipArchive.pipe(output);
    zipArchive.file(inputPath, { name: labelAs });
    zipArchive.finalize(function (err, bytes) {
        if (err)
            throw err;
    });
}

/// Encrypts the file with the specified key, using AES
//  Calls callback() on success, throws err on error.
function encryptFile(inputPath, outputPath, key, callback) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var input = fs.createReadStream(inputPath, { autoClose: true });
    var output = fs.createWriteStream(outputPath, { autoClose: true });

    input.pipe(cipher).pipe(output);

    output.on('finish', function () {
        if (callback)
            callback();
    });
}

/// Just copies the file.
// Calls callback(err) when done.
function copyFile(inputPath, outputPath, callback) {
    if (!callback) callback = function () {
    }
    var cbCalled = false;
    var rd = fs.createReadStream(inputPath, { autoClose: true });
    rd.on("error", function (err) {
        console.log("cannot read: " + err);
        done(err);
    });
    var wr = fs.createWriteStream(outputPath, { autoClose: true });
    wr.on("error", function (err) {
        console.log("cannot write: " + err);
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);
    function done(err) {
        if (!cbCalled) {
            callback(err);
            cbCalled = true;
        }
    }
}
