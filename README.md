# Example usage:

```
var Locker = require('./index.js');
var fsLocker = new Locker('fs');
```

To allow requiring `fs`:

```
fsLocker.unlock();
```

To disallow:

```
fsLocker.lock();
```

For example, if you have these dependencies:
1. `./internal-lib.js` none of whose dependencies requires fs access
2. `./internal-file-reader.js` which needs fs
3. `useful-fs-tool` - external but needs fs
4. `suspicious-external-lib` which does not need fs

So you shoul do:

```
var Locker = require('./index.js');
var fsLocker = new Locker('fs');

var internalFileReader = require('./internal-file-reader.js');
var usefulFsTool = require('useful-fs-tool')

fsLocker.lock();

var internalLib = require('./internal-lib.js');
var suspiciousExternalLib = require('suspicious-external-lib');

```

Or, if you have to keep order,

```
var Locker = require('./index.js');
var fsLocker = new Locker('fs');

fsLocker.lock();
var internalLib = require('./internal-lib.js');
fsLocker.unlock();
var internalFileReader = require('./internal-file-reader.js');
var usefulFsTool = require('useful-fs-tool')

fsLocker.lock();
var suspiciousExternalLib = require('suspicious-external-lib');

```

# Notes
1. It is useful to keep fs requiring locked after basic initialization,
because good libraries do not require it dynamically.

2. If a module is required (may be by another modules) twice or more, only first require is affected.
So be careful not to ruin "honest" modules, which could be required by "evil".
See also https://nodejs.org/api/modules.html#modules_caching

3. Of course, you can use this for protecting `http`, `https`, `os` and other built-in libraries.

4. This is **NOT** an ultimate way to protect youself from hackers.
Use your brain, `shrinkwrap`, etc.

5. Russian discussion can be obtained at https://habrahabr.ru/post/322582/