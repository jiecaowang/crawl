"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = exports.getRange = void 0;
var fs = require("fs");
var getRange = function (start, end) {
    return Array.from({ length: end - start + 1 }, function (x, i) { return start + i; });
};
exports.getRange = getRange;
var saveFile = function (fileName, fileString) {
    fs.writeFileSync(fileName, fileString, {
        encoding: 'utf8',
        flag: 'w'
    });
};
exports.saveFile = saveFile;
//# sourceMappingURL=utils.js.map