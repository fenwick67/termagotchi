var Terma = require('../lib/terma');
var assert = require('chai').assert;
var _ = require('lodash');

// terma properties to validate
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

var newTerma = new Terma();

assert.isObject(newTerma,'creating a terma should return an object')

exports.forEach(function(exp){
    assert.isDefined(newTerma[exp],'Terma should have the property '+exp);
});

//terma should export these props when serializing
var serialized = newTerma.toJSON();

exports.forEach(function(exp){
    assert.isDefined(serialized[exp],'Terma.toJSON should have prop '+exp);
});

var sames = [
    'name',
    'colors',
    'sex'
];

newTerma.feed();

//create another terma from the serialized info
var copy = new Terma(serialized);

exports.forEach(function(exp){
    assert.isDefined(serialized[exp],'Terma copy should have prop '+exp);
    if (sames.indexOf(exp) >= 0){
        assert.deepEqual(copy[exp],newTerma[exp],'Copy should have the same property as parent for '+exp);
    }
});


var t1 = new Terma();
var t2 = new Terma();

assert.notEqual(t1.name,t2.name,'termas shouldnt have the same name');

setTimeout(function(){
    copy.play();
    newTerma.feed();

    console.log(copy.status);
    console.log(newTerma.status)
    
    assert.isAbove(newTerma.status.stomach,copy.status.stomach,'feeding the original should cause its stomach to fill');
    assert.isAbove(copy.status.fun,newTerma.status.fun,'playing with the copy should raise its fun status');

    console.log('tests pass');
    process.exit();
},5000);
