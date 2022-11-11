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
        //Open file for writing. The file is created (if it does not exist) or truncated (if it exists). 
        //https://stackoverflow.com/questions/27920892/in-fs-writefileoption-how-an-options-parameter-generally-work
    });
};
exports.saveFile = saveFile;
//# sourceMappingURL=utils.js.map