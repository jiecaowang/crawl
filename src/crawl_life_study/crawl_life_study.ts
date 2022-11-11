import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as assert from 'node:assert/strict';
import * as fs from 'fs';
import {getRange} from '../utils';

const axios = require('axios');
const axiosRetry = require('axios-retry');

var currentDownloadCounter = 1;


axiosRetry(axios, {
    retries: 10, // number of retries
    retryDelay: (retryCount: number) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
});

const fetchAudio = async (currentBookNum: number) => {
    const bookUrl = `https://www.rucoc.com/Selbooks/listen/NEW/${currentBookNum}.htm`
    
    currentDownloadCounter++;
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
    currentDownloadCounter--;
    
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

    console.log(`downloading ${currentBookNum} book, life study audio 1 - ${lastLifeStudyNum}`);
    const lifeStudyNumRange = getRange(1, Number(lastLifeStudyNum));

    lifeStudyNumRange.forEach(async function(lifeStudyNum, i) {
        const audioUrl = `https://www.rucoc.com/Selbooks/listen/ListenLS/${currentBookNum}/${lifeStudyNum}.mp3`;
        const audioFileDir = `assets/life_study/${currentBookNum}`;
        const audioFilePath = `${audioFileDir}/${lifeStudyNum}.mp3`;

        if(fs.existsSync(audioFilePath)) {
            return;
        }

        console.log(`Going to save ${audioUrl} to ${audioFilePath}`);
        
        currentDownloadCounter++;
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
                return;
            } else {
                console.log(`something is wrong, book: ${currentBookNum}, lifestudy: ${lifeStudyNum}, ${audioUrl}`);
                if (err && err.response && err.response.status) {
                    console.log(`Failed with status code: ${err.response.status} after 10 retry attempts`);
                }
                throw new Error(`Failed lifestudy`);
            }
          });
        currentDownloadCounter--;
        
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
        
    });

};

async function checkDownloadCounter(currentBookNum: number) {
    if(currentDownloadCounter > 10) {
        setTimeout(function() {
            checkDownloadCounter(currentBookNum)
        } , 300); 
    } else {
        await fetchAudio(currentBookNum);
    }
}

export const crawl_life_study_audio = async () => {
    const allBookNums = getRange(1, 66);
    allBookNums.forEach(async function(currentBookNum) {
        await checkDownloadCounter(currentBookNum);
    });
};
