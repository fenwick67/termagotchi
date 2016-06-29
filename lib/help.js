// help function
var _ = require('lodash');

var cmds = [
  ['help','show this'],
  ['play','Play with your Terma'],
  ['feed','feed your Terma'],
  ['clean','clean up after your Terma\'s mess'],
  ['status','Check how your Terma is doing'],
  ['setup','set up your terma']
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