/*
  generate evo tree
  
  go through evos and collect their evo.json, pare down to one file.
  
*/
var FIRST = 'egg';
var glob = require('glob');
var fs = require('fs');

var evoFiles = glob.sync('./evos/*/evo.json');
var evoJsons = evoFiles.map(function(file){
  return JSON.parse(fs.readFileSync(file));
});

var tree = {};

evoJsons.forEach(function(json){
  tree[json.name] = json;
});

fs.writeFileSync('./evos/tree.json',JSON.stringify(tree));