// save preferences

var fs = require('fs');
var filename = "~/.termaprefs";
var _ = require('lodash');

function savePrefs(prefs,callback){
  callback = callback || function(){};
  prefs = prefs || {};
  
  try{ 
    fs.writeFileSync(filename,JSON.stringify(prefs,null,2),{encoding:'utf8'});// #YOLO.
    callback(null);
    return true;
  }catch(e){
    callback(e);
    return false;
  }
}

function loadPrefs(callback){
  callback = callback || function(){};  
  try{ 
    var prefs = JSON.parse(fs.readFileSync(filename,{encoding:'utf8'}));// #YOLO again
    callback(null,prefs);
    return prefs;
  }catch(e){
    callback(e);
    return false;
  }
}

function setPref(prefs,callback){
  loadPrefs(function(er,fromFile){
    if(er){
      callback(er);
    }
    var newPrefs = _extend(fromFile,prefs);
    savePrefs(newPrefs,callback);
  });  
}

module.exports = {
  savePrefs:savePrefs,
  loadPrefs:loadPrefs,
  setPref:setPref
  
}