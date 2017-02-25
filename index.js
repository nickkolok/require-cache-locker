'use strict';

// Firstly, we should create two-level cache
// It should be done once, but anyway...
try {
var uppercache = require.cache;
require.cache = {};
Object.defineProperty(require, 'cache', {
	writable: false,
	configurable: false,
});

/*
// Smth like this will cause an error:
Object.defineProperty(require, 'cache', {
	writable: true,
	configurable: false,
});

// And this will:
require.cache = {};

*/

/*
// However, you can do this:
require.cache[1] = 123;
console.log(require.cache[1]);
*/

// Let's set the link as the prototype
require.cache.__proto__ = uppercache;

// ... and fix it forever!
Object.defineProperty(require, 'cache', {
	writable: false,
	configurable: false,
});
} catch (e) {
    console.log('[require-cache-locker] Double initialization');
}


module.exports =  function (libname) {
    // TODO: trying to create locker for the same lib twice will cause an error

    // Сохраняем себе случайный ключик:
    var randkey = Math.random();
    // Кто считает рандом недостаточно рандомным - предлагайте варианты

    // Заводим свойство по рандомному ключику
    Object.defineProperty(uppercache, randkey, {
        // Мы же не хотим, чтобы его было видно в for..in
        writable : true,
        enumerable : false,
    });

    // И, наконец, заворачиваем обращения к fs на наш ключик
    Object.defineProperty(uppercache, 'fs', {
        get: function() {
            // Спасибо замыканию - даже текст этой функции ничего не даст атакующему
            return !this[randkey];
        },
        configurable : false,
        enumerable : true,
    });

    this.lock = function() {
        require.cache.__proto__[randkey] = false;
    };

    this.unlock = function() {
        require.cache.__proto__[randkey] = true;
    };

}