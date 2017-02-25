var fs = require('fs');

if (fs && fs.stat) {
	console.log('Hahaha! I have access to your fs!')
} else {
	console.log('You win, no access to fs');
}
