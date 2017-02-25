var workingfs = require('fs');
console.log(!!workingfs.stat);

var Locker = require('./index.js');
var fsLocker = new Locker('fs');

// This would cause an error:
// require.cache['fs'] = 0;

console.log(require.cache['fs']);

// And this is pretty useless:
delete require.cache['fs'];

fsLocker.lock();

var fs1 = require('fs');
console.log(!!fs1);

console.log(require.cache['fs']);

// Allow:
fsLocker.unlock();

var fs2 = require('fs');
console.log(!!fs2);

// Gorbid again...
fsLocker.lock();

var fs3 = require('fs');
console.log(!!fs3);

// And a little demo

require('./evil-lib.js');
