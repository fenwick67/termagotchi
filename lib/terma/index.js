/*
Terma model

getState([ts]): return new State JSON for timestamp ts or Now
setState(json,[ts]): set State JSON.

status model:
{
  stomach: n,
  comfort: n,
  bladder: n,
  energy: n,
  fun: n,
  age: n,
  alive:bool
}

Terma JSON model:{
  status:{}// things that change
  name:''
  curves:{},// curves for status
  lastUpdate:JSTimestamp of last update 
}

*/

//constants
var ONE_DAY = 1000 * 60 * 60 * 24;

//requires
var _ = require('lodash');
var randomProps = require('./random-props');
var defaults = require('./defaults');

module.exports = function Terma(old){
  
  var terma = this;
  
  setState(old);// setState is the constuctor method
   
  this.lastUpdate;
  this.curves;
  
  this.status;
  this.asleep;
  this.awakeTime;
  
  function setState(old){// constructor ================================
        
    var old = old || {};// guard empty calls
    defaults.applyDefaults(old);

    _.extend(terma,old);

    fastForward();
    
    //console.log(terma);
  }
  
  
  terma.setState = setState;
  
  // update terma every second or so for fun
  setInterval(fastForward,1000);  
  
  function fastForward(){
    var now = Date.now();
    var dt = (now - terma.lastUpdate) / ONE_DAY;//dt is in days
    
    if (terma.status.alive){
      //loop over status and update based on curves
      _.each(terma.status,function(val,key){
        if (typeof terma.curves[key] == 'number'){
          terma.status[key] = clip01( val + dt * terma.curves[key] );
          //console.log(terma.status[key]);
          if (terma.status[key] <= 0){
            terma.status.alive = false;// YOU MONSTER
          }
        }
      });
    }
    //update asleep
    if (terma.awakeTime < now){
      terma.asleep = false;
    }
    
    // TODO update mood state machine
    
    //we updated :)
    terma.lastUpdate = now;    
  }
  
  terma.fastForward = fastForward;
  
  // holy aliases batman
  this.toJSON = this.getJSON = this.getState = this.getStatus = function getState(){
    fastForward();
    //these are exported and need to be symettrically deserialized into a terma
    var exports = [
      'status',
      'age',
      'name',
      'colors',
      'curves',
      'lastUpdate',
      'asleep',
      'busy',
      'busyReleaseTime',
      'sex'
    ]
    var ret = {};
    _.each(exports,function(prop){
      ret[prop] = terma[prop];
    });
    return _.cloneDeep (ret);
  }
  
  
  // call fastForward, then if busy, call the interaction and fast forward again.
  function wrapInteraction(interaction){
    fastForward();
     if (terma.busy)
        return;
    // call interaction
    interaction();
    fastForward();
  }

  // interactions follow: =================================================
  this.feed = function(amount){
    wrapInteraction(function(){
      var amount = amount || 1;
      amount = gt0(amount/10);
      //feed me
      terma.status.stomach = terma.status.stomach + amount;
      terma.status.energy = terma.status.energy - amount/2; 
      terma.status.bladder = terma.status.bladder - amount/2; 
    });
  }
  
  this.play = function(amount){
    wrapInteraction(function(){
      var amount = amount || 1;
      amount = gt0(amount/10);
      terma.status.fun = terma.status.fun + amount;
      terma.status.energy = terma.status.energy - amount/.5; 
    });        
  }
  
  this.sleep = function(time){
    wrapInteraction(function(){
      var time = time || 60*1000;
      terma.awakeTime = (terma.awakeTime|| (new Date().getTime()) ) + time;
      terma.asleep = true;
    });
  }
  
  this.awaken = function(){
    fastForward();
    if (terma.busy)
        return;
      
    fastForward();// apply sleep with FastForward
    terma.awakeTime = Date.now() - 1;
    terma.asleep = false;
  }
  
  this.toilet = function(){
    wrapInteraction(function(){
      terma.status.energy = terma.status.energy - 1/10; 
      terma.status.bladder = 1;
      terma.status.comfort = terma.status.energy - 1/10;
    });
  }
  
  this.bath = function(amount){
    wrapInteraction(function(){      
      var amount = amount || 1;
      amount = amount / 2;
      terma.status.comfort = terma.status.comfort + amount;
      terma.status.energy = terma.status.energy - amount / 4;
      terma.status.bladder = terma.status.bladder - amount / 4;
      fastForward();
    });
  }
  


  return this;
}


// helpers =============================================================

//limit a number to between 0 and 1
function clip01(value){
  return Math.max(Math.min(value,1),0);  
}

//ensure greater than or equal to 0
function gt0(number){
  return Math.max(0,number) || 0;  
}