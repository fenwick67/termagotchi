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
var ONE_DAY = 1000 * 60 * 60;
var randomName = require('./random-name');

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
    terma.name = old.name || randomName();
    terma.asleep = old.asleep || false;
    
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
  
  
  this.toJSON = this.getJSON = this.getState = function getState(){
    fastForward();
    var exports = ['status','name','curves','lastUpdate','asleep']
    var ret = {};
    _.each(exports,function(prop){
      ret[prop] = terma[prop];
    });
    return ret;
  }
  
  
  this.feed = function(amount){
    amount = gt0(amount/10) || 1/10;    
    //feed me
    terma.status.stomach = terma.status.stomach + amount;
    terma.status.energy = terma.status.energy - amount/.5; 
    terma.status.bladder = terma.status.bladder + amount/.5; 
    terma.fastForward();
  }
  
  this.play = function(amount){
    amount = gt0(amount/10) || 1/10;    
    //feed me
    terma.status.fun = terma.status.fun + amount;
    terma.status.energy = terma.status.stomach - amount/.5;   
    terma.fastForward();
  }
  
  this.sleep = function(time){
    terma.awakeTime = (terma.awakeTime|| (new Date().getTime()) ) + time;
    terma.asleep = true;
    terma.fastForward();
  }
  
  this.awaken = function(){
    terma.fastForward();// apply sleep with FastForward
    terma.awakeTime = Date.now() - 1;
    terma.asleep = false;
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