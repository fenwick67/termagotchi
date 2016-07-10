var randomProps = require('./random-props');
var _ = require('lodash');

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

function applyDefaults(terma){
    var now = Date.now() - 1;

    var miscDefaults = {
        busy:false,
        busyReleaseTime:now,
        evo:'blob',
        mood:'happy',
        age:0,
        asleep:false,
        activity:'none',
        status:defaultStatus,
        curves:defaultCurves,
        colors:randomProps.colors(),
        lastUpdate:now
    }
    
    _.each(miscDefaults,function(value,key){
        applyIfUndefined(terma,key,value);
    });

    // name and sex go together so handle them manually
    if (isUndef(terma.sex) || isUndef(terma.name)){
        var nas = randomProps.nameAndSex();
        terma.name = nas.name;
        terma.sex = nas.sex;
    }

}

function applyIfUndefined(obj,propName,fallback){
    if (isUndef(obj[propName])){
        obj[propName] = _.clone(fallback);
    }
}

function isUndef(thing){
    return (thing == null || typeof thing == 'undefined');
}

module.exports = {
    applyDefaults:applyDefaults
}

