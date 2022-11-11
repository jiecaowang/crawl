import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as assert from 'node:assert/strict';
import * as fs from 'fs';
import {getRange} from '../utils';

const axios = require('axios');
const axiosRetry = require('axios-retry');
const bookNumberTolifeStudyMaxNumber = {
    '1': 120,
    '2': 185,
    '3': 64,
    '4': 53,
    '5': 30,
    '6': 15,
    '7': 10,
    '8': 8,
    '9': 19,
    '10': 19,
    '11': 11,
    '12': 12,
    '13': 5,
    '14': 8,
    '15': 5,
    '16': 5,
    '17': 3,
    '18': 38,
    '19': 45,
    '20': 8,
    '21': 2,
    '22': 10,
    '23': 54,
    '24': 40,
    '25': 4,
    '26': 27,
    '27': 17,
    '28': 9,
    '29': 7,
    '30': 3,
    '31': 1,
    '32': 1,
    '33': 4,
    '34': 1,
    '35': 3,
    '36': 1,
    '37': 1,
    '38': 15,
    '39': 4,
    '40': 72,
    '41': 70,
    '42': 79,
    '43': 51,
    '44': 72,
    '45': 69,
    '46': 69,
    '47': 59,
    '48': 46,
    '49': 97,
    '50': 62,
    '51': 65,
    '52': 24,
    '53': 7,
    '54': 12,
    '55': 8,
    '56': 6,
    '57': 2,
    '58': 69,
    '59': 14,
    '60': 34,
    '61': 13,
    '62': 40,
    '63': 2,
    '64': 2,
    '65': 5,
    '66': 68
  };

var missedLifeStudy = {};

var is404 = false;

axiosRetry(axios, {
    retries: 10, // number of retries
    retryDelay: (retryCount: number) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
});

const populateLifeStudyMaxNumber = async (currentBookNum: number) => {
    const bookUrl = `https://www.rucoc.com/Selbooks/listen/NEW/${currentBookNum}.htm`
    
    const response = await axios.request({
        method: 'GET',
        url: bookUrl,
        responseType: 'arraybuffer',
        responseEncoding: 'binary',
        maxRedirects: 1,
        }).catch((err) => {
        if (err && err.response && err.response.status === 404) {
            console.log(`no such book, book: ${currentBookNum}, ${bookUrl}`);
            return;
        } else {
            console.log(`something is wrong, book: ${currentBookNum}, ${bookUrl}`);
            if (err && err.response && err.response.status) {
                console.log(`Failed with status code: ${err.response.status} after 10 retry attempts`);
            }
            throw new Error(`Failed book`);
        };
        });
    
    const binaryHtml = response.data;
    const chineseHtml = iconv.decode(binaryHtml, 'gb2312');

    const $ = cheerio.load(chineseHtml);
    const content = $('tbody tr:last-child td:first-child font');
    if (content.has('br')) {
        content.remove('br');
    }
    
    const lastRowString = content.text();
    const lastLifeStudyNumArray = Array.from(lastRowString.matchAll(/第\s+(\d+)\s+篇/g));
    assert.strictEqual(lastLifeStudyNumArray.length, 1, "Should only have 1 place stating the last life study number");

    const lastLifeStudyNum = lastLifeStudyNumArray[0][1];
    bookNumberTolifeStudyMaxNumber[currentBookNum] = Number(lastLifeStudyNum);
}

const fetchAndSaveLifeStudyAudio = async (currentBookNum: string, lastLifeStudyNum: number) => {
    const lifeStudyNumRange = getRange(1, Number(lastLifeStudyNum));

    for (const lifeStudyNum of lifeStudyNumRange) {
        const audioUrl = `https://www.rucoc.com/Selbooks/listen/ListenLS/${currentBookNum}/${lifeStudyNum}.mp3`;
        const audioFileDir = `assets/life_study/${currentBookNum}`;
        const audioFilePath = `${audioFileDir}/${lifeStudyNum}.mp3`;

        if(fs.existsSync(audioFilePath)) {
            continue;
        }

        console.log(`Going to save ${audioUrl} to ${audioFilePath}`);
        
        
        const audioResponse = await axios.request({
            method: 'GET',
            url: audioUrl,
            responseType: 'arraybuffer',
            maxRedirects: 1,
            headers: {
                'Content-Type': 'audio/mpeg',
            },
            }).catch((err) => {
            if (err && err.response && err.response.status === 404) {
                console.log(`no such audio file, book: ${currentBookNum}, lifestudy: ${lifeStudyNum}, ${audioUrl}`);
                if (missedLifeStudy[currentBookNum]) {
                    missedLifeStudy[currentBookNum].push(lifeStudyNum);
                } else {
                    missedLifeStudy[currentBookNum] = [lifeStudyNum];
                }
                is404 = true;
            } else {
                console.log(`something is wrong, book: ${currentBookNum}, lifestudy: ${lifeStudyNum}, ${audioUrl}`);
                if (err && err.response && err.response.status) {
                    console.log(`Failed with status code: ${err.response.status} after 10 retry attempts`);
                }
                throw new Error(`Failed lifestudy`);
            }
            });
        
        if (is404) {
            is404 = false;
            continue;
        }
        
        if (!fs.existsSync(audioFileDir)){
            fs.mkdirSync(audioFileDir);
        }

        fs.writeFileSync(audioFilePath, audioResponse.data, 
            {
                flag: 'w'
                //Open file for writing. The file is created (if it does not exist) or truncated (if it exists). 
                //https://stackoverflow.com/questions/27920892/in-fs-writefileoption-how-an-options-parameter-generally-work
            }
        );

        console.log(`Saved ${audioUrl} to ${audioFilePath}`);
    }
}

const printDictionary = (dictionary: Object, mapName: String) => {
    console.log(dictionary);
    console.log(`size of ${mapName} is: ${Object.keys(dictionary).length}`);
}

export const crawl_life_study_audio = async () => {
    // const allBookNums = getRange(1, 66);

    // for (const currentBookNum of allBookNums) {
    //     await populateLifeStudyMaxNumber(currentBookNum);
    // }

    // printDictionary(bookNumberTolifeStudyMaxNumber, 'bookNumberTolifeStudyMaxNumber');

    for (const [currentBookNum, lastLifeStudyNum] of Object.entries(bookNumberTolifeStudyMaxNumber)) {
        await fetchAndSaveLifeStudyAudio(currentBookNum, lastLifeStudyNum);
    }

    printDictionary(missedLifeStudy, 'missed life study');
};