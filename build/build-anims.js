// this module builds the anims.json for evos
// it's a build script so it's sync... files are tiny anyway.

var fs = require('fs');
var path = require('path');
var async = require('async');
var PNGReader = require('png.js');
var glob = require('glob');

var evoDirs = glob.sync('./evos/*/');
//console.log(evoDirs);
  
// parse then write out images.json

var grail = {};

async.eachSeries(evoDirs,function(dir,callback){
  
  var evoName = path.parse(dir).name;

  var files = fs.readdirSync(dir);
  console.log(files);
  var pngs = [];
  files.forEach(function(filename){
    if (filename.indexOf('.png') > -1){
      pngs.push(path.join(dir,filename));
    }
  });
  
  pngs = pngs.sort();//sort low to high
  
  //with pngs being a list of files...
  var anims = {};
  
  function getPngData(file,callback){
    var buffer = fs.readFileSync(file)
    var reader = new PNGReader(buffer);
    reader.parse(function(err, png){
      if (err) throw err;
      
      var animName = path.parse(file).name.replace(/[0-9]+/ig,'');
      
      var sparse = {
        width:png.width,
        height:png.height,
        data:png.pixels
      }
      
      //put it in "anims".  Make it an array.
      anims[animName] = anims[animName] || [];
      anims[animName].push(sparse);
      
      callback(null,png);
    });       
  }
  
  async.eachSeries(pngs,getPngData,function(er){
    // got PNG data in Anims
    grail[evoName] = anims;
    callback(null);
  });  
      
  
},function(done){//done!
  console.log(grail);
  fs.writeFileSync('./evos/anims.json',JSON.stringify(grail));
  console.log('done');
});
