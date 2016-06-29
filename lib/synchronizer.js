// This syncs the terma's state to the riht places based on the user's preferences.

var prefSaver = require('./pref-saver')
module.exports = function(prefs,onLoad){
  
  if(!prefs){
     prefSaver.loadPrefs(function(er,loadedPrefs){
      if (er){
        throw (er);
      }else{
        if (onLoad){onLoad(loadedPrefs)}
        manageState(loadedPrefs);
      }
    })
  }else{
    if(onLoad){onLoad(prefs)}
    manageState(prefs);
  }
  
  this.getState = function(callback){
    return _getState(callback);
  } 
    
  this.postState = function(s,callback){
    return _postState(callback);
  }
  
  function manageState(preferences){
        
  }
  
}