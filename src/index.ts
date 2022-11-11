import crawl_hymn from "./crawl_hymn/crawl_hymn";
import { crawl_life_study_audio } from "./crawl_life_study/crawl_life_study";

const PROMPT_QUERY = `What do you want crawl?
- type 1 for hymns
- type 2 for life study audio
- type 3 for life study text
- type q to quit anytime
`;

const main = () => {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    
    rl.question(PROMPT_QUERY, async function (crawl_number: string) {
        switch(crawl_number) {
            case '1':
                crawl_hymn();
            case '2':
                await crawl_life_study_audio();
            case '3':
            default:
                rl.close();
        }
    });
    
    rl.on('q', function () {
        console.log('\nBYE BYE !!!');
        process.exit(0);
    });
};

// main();
console.log('here1');
crawl_life_study_audio();
