"use strict";
exports.__esModule = true;
exports.Hashing = void 0;
var crypto_1 = require("crypto");
var Hashing = /** @class */ (function () {
    function Hashing() {
    }
    Hashing.sha256 = function (text) {
        return Hashing.hash('sha256', text);
    };
    Hashing.sha1 = function (text) {
        return Hashing.hash('sha1', text);
    };
    Hashing.md5 = function (text) {
        return Hashing.hash('md5', text);
    };
    Hashing.hash = function (algorithm, text) {
        var hash = (0, crypto_1.createHash)(algorithm);
        hash.update(text);
        return hash.digest('hex');
    };
    return Hashing;
}());
exports.Hashing = Hashing;
