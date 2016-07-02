// This syncs the terma's state to the riht places based on the user's preferences.

var prefSaver = require('./pref-saver')
var fs = require('fs');
var Terma = require('./terma')
var filename = '~/.termagotchi';
var mkdirp = require('mkdirp');
module.exports = function(){
  var synchronizer = this;
  

  // the ultimate... get a terma from fs or gist
  this.getTerma = function getTerma(callback){
    var prefs;    
    // load prefs
    prefSaver.loadPrefs(function(er,prefs){
      if(er){
        //  PANIC
        console.error(e);
      }
      
      if (prefs.gist){
        //  PANIC
        console.error("cant load from gist yet");
      }else{
        //get terma from FS
        getTermaFromFs(callback);
      }
    });
    
  }
  
  this.saveTerma = function saveTerma(terma,callback){
    var prefs;    
    // load prefs
    prefSaver.loadPrefs(function(er,prefs){
      if(er){
        //  PANIC
        console.error(e);
      }
      
      if (prefs.gist){
        //  PANIC
        console.error("cant load from gist yet");
      }else{
        // save to FS
        saveTermaToFs(terma,callback);
      }
    });    
    
  }
  
    
  function getTermaFromFs(cb){
    makeHome(function(){
      //read terma file    
      fs.readFile(filename,'utf8',function(er,data){
        if(er){//TODO handle this error
          console.error('RETURNING DEFAULT TERMA BECAUSE ',er);
          return cb(null,new Terma());
        }
        try{
          // create terma from the JSON
          var theTerma = new Terma(JSON.parse(data));
          //console.log(theTerma)
          return cb(null,theTerma)
        }catch(e){
          return cb(er);
        }      
      });     
      
    });
    
  }
  
  function saveTermaToFs(terma,cb){    
    var save = JSON.stringify(terma.toJSON());
    fs.writeFile(filename,save,cb);
  }
  
  //make the home directory :///
  function makeHome(cb){
    mkdirp('~',{fs:fs},cb);
  }
  
  return this;
}