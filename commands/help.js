// help function
var _ = require('lodash');

var cmds = [
  ['help','show this'],
  ['play','Play with your Terma'],
  ['feed','feed your Terma'],
  ['status','Check how your Terma is doing'],
];

var cmdString = '';

_.each(cmds,function(el,idx){
  cmdString = cmdString + '\n  ' + _.padEnd(el[0],10) + ':   ' + el[1];
});

cmdString = cmdString + '\n';

module.exports = function(args,done){
  this.writeln('Here are some available commands:');
  this.writeln(cmdString);
  done();  
}