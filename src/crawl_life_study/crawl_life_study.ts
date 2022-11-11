import * as cheerio from 'cheerio';
import {saveFile, getRange} from '../utils';
import * as iconv from 'iconv-lite';

const axios = require('axios');

const fetchAudio = async (bookUrl: string) => {
    // console.log(`hi crawling for ${bookUrl}`);
    const response = await axios.request({
        method: 'GET',
        url: bookUrl,
        responseType: 'arraybuffer',
        responseEncoding: 'binary'
      });
    const binaryHtml = response.data;
    const chineseHtml = iconv.decode(binaryHtml, 'gb2312');

    const $ = cheerio.load(chineseHtml);
    const content = $('tbody tr:last-child td:first-child font');
    if (content.has('br')) {
        content.remove('br');
    }
    
    console.log(content.text());
};

export const crawl_life_study_audio = async () => {
    await fetchAudio("https://www.rucoc.com/Selbooks/listen/NEW/4.htm");
};