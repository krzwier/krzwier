const CryptoJS = require('crypto-js');

const funkyTown = function (message, key) {
    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
}

module.exports = funkyTown;



