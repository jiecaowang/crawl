import fetch from 'sync-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';

const getRange = (start, end) => {
    return Array.from({length: end - start + 1}, (x, i) => start + i);
};

const fetchSong = async (url) => {
    console.log({url}); 
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    var content = $('#song-title').text().trim();
    
    $('.lyrics td').not('.verse-num').each(function() {
        const verse = $(this).text().trim();
        content = content + '\n' + verse;
    });
    // console.log({content}); 
    return content;
}

const saveFile = (fileName, fileString) => {
    fs.writeFileSync(fileName, fileString, 
        {
            encoding: 'utf8',
            flag: 'w'
        });
}


const fetchAndSaveSong = async (songUrl, songFileName) => {
    const content = await fetchSong(songUrl);
    
    saveFile(songFileName, content);
}

const DA_BEN_RANGE = getRange(1, 780);
const BU_CHONG_BEN_RANGE_LISTS = [[1, 37], [101, 150], [201, 258], [301, 349], [401, 470], [501, 543], [601, 629], [ 701, 762], [ 801, 880], [901, 930], [1001, 1005]];
const BU_CHONG_RANGE = BU_CHONG_BEN_RANGE_LISTS.map((range) => {return getRange(range[0], range[1]);}).flat(1);

const DA_BEN_URL_PREFIX = 'https://www.hymnal.net/cn/hymn/ch/';
const BU_CHONG_BEN_URL_PREFIX = 'https://www.hymnal.net/cn/hymn/ts/';

const DA_BEN_FILE_PREFIX = 'assets/daBen/';
const BU_CHONG_BEN_FILE_PREFIX = 'assets/buChongBen/';

// var daBenSample = fetchAndSaveSong(DA_BEN_URL_PREFIX + '11', DA_BEN_FILE_PREFIX + '6');
//  var buChongBenSample = fetchAndSaveSong(BU_CHONG_BEN_URL_PREFIX + '110', BU_CHONG_BEN_FILE_PREFIX + '110');

DA_BEN_RANGE.forEach(function(songNumber) {
    const songUrl = DA_BEN_URL_PREFIX + songNumber;
    const songFileName = DA_BEN_FILE_PREFIX + songNumber;
    fetchAndSaveSong(songUrl, songFileName);
});

BU_CHONG_RANGE.forEach(function(songNumber) {
    const songUrl = BU_CHONG_BEN_URL_PREFIX + songNumber;
    const songFileName = BU_CHONG_BEN_FILE_PREFIX + songNumber;
    // console.log({songUrl, songFileName});
    fetchAndSaveSong(songUrl, songFileName);
});

// console.log({BU_CHONG_RANGE});