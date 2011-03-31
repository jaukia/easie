if (typeof global.system !== 'undefined') {
    print('Narwhal Jake not supported (use node-jake instead)');
    return;
}

var sys = require('sys');
var path = require('path');
var fs = require('fs');

var util = require('util');

var uglify = require("uglify-js");
var jsp = uglify.parser;
var pro = uglify.uglify;

var spawn = require('child_process').spawn;

desc('Minifies js files');
task('minify', [], function() {
  var minifyFile = function(originalFileName,outFileName) {
    var contents = fs.readFileSync(originalFileName);
    var ast = jsp.parse(contents.toString());
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    var final_code = pro.gen_code(ast);
    outFile = fs.openSync(outFileName, 'w+');
    var writeStatus = fs.writeSync(outFile, final_code);
    fs.closeSync(outFile);
  }
  
  minifyFile('js/jquery.easie.js', "build/jquery.easie-min.js");
  
});

desc('Main build task');
task('build', ['minify'], function() {});

desc('Default task');
task('default', ['build'], function() {});