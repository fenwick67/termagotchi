/*
Ayoooooo

*/

var Cli = require('xplat-cli');
var cli = Cli();

cli
.delimiter('~*~')
.command('__intro',require('./commands/intro'))
.command('help',require('./lib/help'))
.command('login',require('./lib/login'))
//.command('feed',require('./commands/feed'))
//.command('clean',require('./commands/clean'))
//.command('play',require('./commands/play'))
.run('__intro')