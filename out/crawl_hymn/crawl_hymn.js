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
var cheerio = require("cheerio");
var utils_1 = require("../utils");
var DA_BEN_RANGE = (0, utils_1.getRange)(1, 780);
var BU_CHONG_BEN_RANGE_LISTS = [[1, 37], [101, 150], [201, 258], [301, 349], [401, 470], [501, 543], [601, 629], [701, 762], [801, 880], [901, 930], [1001, 1005]];
var BU_CHONG_RANGE = BU_CHONG_BEN_RANGE_LISTS.map(function (range) { return (0, utils_1.getRange)(range[0], range[1]); }).flat(1);
var DA_BEN_URL_PREFIX = 'https://www.hymnal.net/cn/hymn/ch/';
var BU_CHONG_BEN_URL_PREFIX = 'https://www.hymnal.net/cn/hymn/ts/';
var DA_BEN_FILE_PREFIX = 'assets/daBen/';
var BU_CHONG_BEN_FILE_PREFIX = 'assets/buChongBen/';
var fetchSong = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var response, html, $, content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log({ url: url });
                return [4 /*yield*/, fetch(url)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 2:
                html = _a.sent();
                $ = cheerio.load(html);
                content = $('#song-title').text().trim();
                $('.lyrics td').not('.verse-num').each(function () {
                    var verse = $(this).text().trim();
                    content = content + '\n' + verse;
                });
                // console.log({content}); 
                return [2 /*return*/, content];
        }
    });
}); };
var fetchAndSaveSong = function (songUrl, songFileName) { return __awaiter(void 0, void 0, void 0, function () {
    var content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchSong(songUrl)];
            case 1:
                content = _a.sent();
                (0, utils_1.saveFile)(songFileName, content);
                return [2 /*return*/];
        }
    });
}); };
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // var daBenSample = fetchAndSaveSong(DA_BEN_URL_PREFIX + '11', DA_BEN_FILE_PREFIX + '6');
            //  var buChongBenSample = fetchAndSaveSong(BU_CHONG_BEN_URL_PREFIX + '110', BU_CHONG_BEN_FILE_PREFIX + '110');
            DA_BEN_RANGE.forEach(function (songNumber) {
                return __awaiter(this, void 0, void 0, function () {
                    var songUrl, songFileName;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                songUrl = DA_BEN_URL_PREFIX + songNumber;
                                songFileName = DA_BEN_FILE_PREFIX + songNumber;
                                return [4 /*yield*/, fetchAndSaveSong(songUrl, songFileName)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            BU_CHONG_RANGE.forEach(function (songNumber) {
                return __awaiter(this, void 0, void 0, function () {
                    var songUrl, songFileName;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                songUrl = BU_CHONG_BEN_URL_PREFIX + songNumber;
                                songFileName = BU_CHONG_BEN_FILE_PREFIX + songNumber;
                                // console.log({songUrl, songFileName});
                                return [4 /*yield*/, fetchAndSaveSong(songUrl, songFileName)];
                            case 1:
                                // console.log({songUrl, songFileName});
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.default = default_1;
;
//# sourceMappingURL=crawl_hymn.js.map