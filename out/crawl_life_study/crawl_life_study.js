"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawl_life_study_audio = void 0;
var cheerio = require("cheerio");
var iconv = require("iconv-lite");
var assert = require("node:assert/strict");
var fs = require("fs");
var utils_1 = require("../utils");
var axios = require('axios');
var BOOK_URL_PREFIX = 'https://www.rucoc.com/Selbooks/listen/NEW/';
var BOOK_URL_SUFFIX = '.htm';
var FIRST_BOOK_NUM = 1;
var FIRST_LIFE_STUDY_NUM = 1;
var AUDIO_URL_PREFIX = 'https://www.rucoc.com/Selbooks/listen/ListenLS/';
var fetchAudio = function (currentBookNum) { return __awaiter(void 0, void 0, void 0, function () {
    var bookUrl, response, binaryHtml, chineseHtml, $, content, lastRowString, lastLifeStudyNumArray, lastLifeStudyNum, lifeStudyNumRange;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bookUrl = "".concat(BOOK_URL_PREFIX).concat(currentBookNum).concat(BOOK_URL_SUFFIX);
                return [4 /*yield*/, axios.request({
                        method: 'GET',
                        url: bookUrl,
                        responseType: 'arraybuffer',
                        responseEncoding: 'binary'
                    })];
            case 1:
                response = _a.sent();
                binaryHtml = response.data;
                chineseHtml = iconv.decode(binaryHtml, 'gb2312');
                $ = cheerio.load(chineseHtml);
                content = $('tbody tr:last-child td:first-child font');
                if (content.has('br')) {
                    content.remove('br');
                }
                lastRowString = content.text();
                console.log("last row string: ".concat(lastRowString));
                lastLifeStudyNumArray = Array.from(lastRowString.matchAll(/第\s+(\d+)\s+篇/g));
                assert.strictEqual(lastLifeStudyNumArray.length, 1, "Should only have 1 place stating the last life study number");
                lastLifeStudyNum = lastLifeStudyNumArray[0][1];
                console.log("last life study num: ".concat(lastLifeStudyNum));
                lifeStudyNumRange = (0, utils_1.getRange)(FIRST_LIFE_STUDY_NUM, Number(lastLifeStudyNum));
                lifeStudyNumRange.forEach(function (lifeStudyNum) {
                    return __awaiter(this, void 0, void 0, function () {
                        var bookSlashLifeStudyMp3, audioUrl, audioResponse, audioFilePath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    bookSlashLifeStudyMp3 = "".concat(currentBookNum, "/").concat(lifeStudyNum, ".mp3");
                                    audioUrl = "".concat(AUDIO_URL_PREFIX).concat(bookSlashLifeStudyMp3);
                                    return [4 /*yield*/, axios.request({
                                            method: 'GET',
                                            url: audioUrl,
                                            responseType: 'arraybuffer',
                                            headers: {
                                                'Content-Type': 'audio/mpeg',
                                            },
                                        })];
                                case 1:
                                    audioResponse = _a.sent();
                                    audioFilePath = "assets/life_study/".concat(bookSlashLifeStudyMp3);
                                    fs.writeFileSync(audioFilePath, audioResponse.data, {
                                        flag: 'w'
                                        //Open file for writing. The file is created (if it does not exist) or truncated (if it exists). 
                                        //https://stackoverflow.com/questions/27920892/in-fs-writefileoption-how-an-options-parameter-generally-work
                                    });
                                    console.log("Finished saving ".concat(audioUrl, " to ").concat(audioFilePath));
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
var crawl_life_study_audio = function () { return __awaiter(void 0, void 0, void 0, function () {
    var allBookNums;
    return __generator(this, function (_a) {
        allBookNums = (0, utils_1.getRange)(1, 66);
        allBookNums.forEach(function (currentBookNum) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetchAudio(currentBookNum)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        return [2 /*return*/];
    });
}); };
exports.crawl_life_study_audio = crawl_life_study_audio;
//# sourceMappingURL=crawl_life_study.js.map