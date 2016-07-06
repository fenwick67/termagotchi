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

module.exports = function Terma(old){
  
  var terma = this;
  
  setState(old);// setState is the constuctor method
   
  this.lastUpdate;
  this.curves;
  
  this.status;
  this.asleep;
  this.awakeTime;  
  
  function setState(old){//constructor
    var defaultStatus = {
      stomach: 1,
      comfort: 1,
      bladder: 1,
      energy: 1,
      fun: 1,
      age: 0,
      alive:true
    }
    
    var defaultCurves = {// rate is in points per day.
      stomach: -.5,
      comfort: -.5,
      bladder: -.5,
      energy: -.5,
      fun: -.5,
      age: +.5
    }      
    
    var old = old || {};// guard empty calls
    
    oldTimestamp = old.timestamp || new Date().getTime();
    var now = Date.now();
    var diff = oldTimestamp - now;
    
    // TODO implement timeouts on terma activity (busy and busyReleaseTime)
    terma.busy = old.busy || false;
    terma.busyReleaseTime = old.busyReleaseTime || now;
    
    terma.activity = old.activity || 'none';
    terma.colors = old.colors||randomProps.colors;
    
    if (!old.sex || !old.name){
      var nas = randomProps.nameAndSex();
      terma.sex = nas.sex;
      terma.name = nas.name;
    }else{
      terma.sex = old.sex||'female';
      terma.name = old.name||'MissingNo';
    }
    
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
    
    //console.log(terma);
  }
  terma.setState = setState;
  
  // update terma every second or so for fun
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
    //these are exported and need to be symettrically deserialized into a terma
    var exports = [
      'status',
      'name',
      'colors',
      'curves',
      'lastUpdate',
      'asleep',
      'busy',
      'busyReleaseTime'
    ]
    var ret = {};
    _.each(exports,function(prop){
      ret[prop] = terma[prop];
    });
    return ret;
  }
  
  
  // interactions follow: =================================================
  this.feed = function(amount){
    fastForward();
    if (terma.busy)
        return;
    
    var amount = amount || 1;
    amount = gt0(amount/10);
    //feed me
    terma.status.stomach = terma.status.stomach + amount;
    terma.status.energy = terma.status.energy - amount/2; 
    terma.status.bladder = terma.status.bladder - amount/2; 
    fastForward();
  }
  
  this.play = function(amount){
    fastForward();
    if (terma.busy)
        return;
      
    var amount = amount || 1;
    amount = gt0(amount/10);
    terma.status.fun = terma.status.fun + amount;
    terma.status.energy = terma.status.energy - amount/.5;   
    fastForward();
  }
  
  this.sleep = function(time){
    fastForward();
    if (terma.busy)
        return;
      
    var time = time || 60*1000;
    terma.awakeTime = (terma.awakeTime|| (new Date().getTime()) ) + time;
    terma.asleep = true;
    fastForward();
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
    fastForward();
    if (terma.busy)
        return;
      
    terma.status.energy = terma.status.energy - 1/10; 
    terma.status.bladder = 1;
    terma.status.comfort = terma.status.energy - 1/10;
    fastForward();
  }
  
  this.bath = function(amount){fastForward();
    if (terma.busy)
        return;
      
    var amount = amount || 1;
    amount = amount / 2;
    terma.status.comfort = terma.status.comfort + amount;
    terma.status.energy = terma.status.energy - amount / 4;
    terma.status.bladder = terma.status.bladder - amount / 4;
    fastForward();
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