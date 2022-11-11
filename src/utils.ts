import * as fs from 'fs';

export const getRange = (start: number, end: number) => {
    return Array.from({length: end - start + 1}, (x, i) => start + i);
};

export const saveFile = (fileName: string, fileString: string) => {
    fs.writeFileSync(fileName, fileString, 
        {
            encoding: 'utf8',
            flag: 'w'
            //Open file for writing. The file is created (if it does not exist) or truncated (if it exists). 
            //https://stackoverflow.com/questions/27920892/in-fs-writefileoption-how-an-options-parameter-generally-work
        });
};
