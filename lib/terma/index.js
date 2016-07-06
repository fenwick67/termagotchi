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

var _ = require('lodash');
var ONE_DAY = 1000 * 60 * 60 * 24;
var randomProps = require('./random-props');

module.exports = function Terma(old){
  
  var terma = this;
  
  setState(old);// setState is the constuctor method
   
  this.lastUpdate;
  this.curves;
  
  this.status;
  this.asleep;
  this.awakeTime;  
  
  function setState(old){
    var defaultStatus = {
      stomach: 1,
      comfort: 1,
      bladder: 1,
      energy: 1,
      fun: 1,
      age: 0,
      alive:true
    }
    
    var defaultCurves = {
      stomach: -1,
      comfort: -1,
      bladder: -1,
      energy: -1,
      fun: -1,
      age: +1
    }      
    
    var old = old || {};// guard empty calls
    
    oldTimestamp = old.timestamp || new Date().getTime();
    var now = Date.now();
    var diff = oldTimestamp - now;
    
    
    // TODO implement timeouts on terma activity.
    terma.busy = old.busy || false;
    terma.busyReleaseTime = old.busyReleaseTime || now;
    terma.activity = old.activity || 'none';
    
    terma.sex = old.sex;
    terma.name = old.name;
    
    if (!old.sex || !old.name){
      var 
    }
    
    terma.asleep = old.asleep || false;
    
    terma.
    
    
    if (!old.curves || !old.status){
      //make a new terma!
      terma.curves = defaultCurves;
      terma.status = defaultStatus;
      terma.lastUpdate = Date.now() - 1;
    }else{
      terma.curves = old.curves;
      terma.status = old.status;
      terma.lastUpdate = old.lastUpdate;      
    }
    
    fastForward();
    
    console.log(terma);
  }
  terma.setState = setState;
  
  // update terma every second
  setInterval(fastForward,1000);
  
  
  function fastForward(){
    var now = Date.now();
    var dt = (now - terma.lastUpdate) / ONE_DAY;//dt is in days
    
    if (dt !== 0 && terma.status.alive){
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
    
    //we updated :)
    terma.lastUpdate = now;    
  }
  
  terma.fastForward = fastForward;
  
  // holy aliases batman
  this.toJSON = this.getJSON = this.getState = this.getStatus = function getState(){
    fastForward();
    var exports = ['status','name','curves','lastUpdate','asleep','busy','busyReleaseTime']
    var ret = {};
    _.each(exports,function(prop){
      ret[prop] = terma[prop];
    });
    return ret;
  }
  
  
  // interactions
  this.feed = function(amount){
    var amount = amount || 1;
    amount = gt0(amount/10);
    //feed me
    terma.status.stomach = terma.status.stomach + amount;
    terma.status.energy = terma.status.energy - amount/2; 
    terma.status.bladder = terma.status.bladder - amount/2; 
    fastForward();
  }
  
  this.play = function(amount){
    var amount = amount || 1;
    amount = gt0(amount/10);
    terma.status.fun = terma.status.fun + amount;
    terma.status.energy = terma.status.energy - amount/.5;   
    fastForward();
  }
  
  this.sleep = function(time){
    var time = time || 60*1000;
    terma.awakeTime = (terma.awakeTime|| (new Date().getTime()) ) + time;
    terma.asleep = true;
    fastForward();
  }
  
  this.awaken = function(){
    fastForward();// apply sleep with FastForward
    terma.awakeTime = Date.now() - 1;
    terma.asleep = false;
  }
  
  this.toilet = function(){
    terma.status.energy = terma.status.energy - 1/10; 
    terma.status.bladder = 1;
    terma.status.comfort = terma.status.energy - 1/10;
    fastForward();
  }
  
  this.bath = function(amount){
    var amount = amount || 1;
    amount = amount / 2;
    terma.status.comfort = terma.status.comfort + amount;
    terma.status.energy = terma.status.energy - amount / 4;
    terma.status.bladder = terma.status.bladder - amount / 4;
    fastForward();
  }
  
  return this;
}


//helpers

//limit a number to between 0 and 1
function clip01(value){
  return Math.max(Math.min(value,1),0);  
}

//ensure greater than or equal to 0
function gt0(number){
  return Math.max(0,number) || 0;  
}