const path = require('path');

exports.appName = 'Dog Clock';
exports.isMac = process.platform === 'darwin';

exports.protocol = 'dog-clock';
exports.scheme = `${this.protocol}://`;
exports.iconPath = path.join(__dirname, '../../build/icons/32x32.png')

exports.remindWindowWidth = 200
exports.remindWindowHeight = 32
