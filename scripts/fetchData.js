const process = require('process');
const fs = require('fs');
const path = require('path');

const apiBaseUrl = 'https://jisho.org/api/v1/search/words';
const keywordParam = '?keyword=';
const hashSign = '%23'

const sleep = ms => new Promise(r => setTimeout(r, ms));


async function fetchWords(levelStr) {
    let apiUrl = apiBaseUrl + keywordParam + hashSign + levelStr;
    let completeData = [];
    let pageCtr = 1;

    console.debug(`starting data fetch for level ${levelStr}`);

    while (true) {
        console.debug(`fetching page ${pageCtr} for level ${levelStr}...`);
        let res = await fetch(`${apiUrl}&page=${pageCtr}`);
        let data = await res.json();
        if (data.meta.status !== 200) {
            console.error('Unexpected error in fetching data...');
            console.error(data);
            process.exit(1);
        }

        if (data.data.length < 1) {
            break;
        }
        console.debug(`fetch for leve ${levelStr} page ${pageCtr} completed...`);
        for (let datum of data.data) {
            completeData.push(datum);
        }
        pageCtr += 1;
    }
    return completeData;

}

async function fetchAll() {
    // only fetches n5 and n4 for now


    let n5Words = await fetchWords('jlpt-n5');

    // actual save objects
    let n5 = {
        fetchDate: Date.now(),
        data: n5Words
    };

    fs.writeFileSync(path.join(dataDirPath, 'n5.json'), JSON.stringify(n5));

    // sleep for 5 seconds, so the api does not get overwhelmed
    console.debug('sleeping for a bit');
    await sleep(5000);
    console.debug('woke up, continuing');
    let n4Words = await fetchWords('jlpt-n4');
    let n4 = {
        fetchDate: Date.now(),
        data: n4Words
    };
    fs.writeFileSync(path.join(dataDirPath, 'n4.json'), JSON.stringify(n4));

}


if (!process.argv[1]) {
    console.error('Please give data directory path...');
    console.error('Syntax : node index /data/dir/path');
    process.exit(1);
}

const dataDirPath = path.resolve(process.argv[2]);

if (!fs.existsSync(dataDirPath)) {
    console.error(`Given path of data directory ${dataDirPath} does not exist...`);
    console.error('Please give correct path');
    process.exit(1);
}


const dataBackupDir = path.join(dataDirPath, 'backup');

if (fs.existsSync(dataBackupDir)) {
    console.debug(`removing existing data backup directory : ${dataBackupDir}`);
    fs.rmSync(dataBackupDir, { recursive: true });
}

console.debug('moving existing .json content of data into backup directory');
fs.mkdirSync(dataBackupDir);

for (let file of fs.readdirSync(dataDirPath)) {
    let ext = path.extname(file);
    if (ext !== '.json') {
        console.debug(`skipping ${file} , as not json`);
        continue;
    }
    let src = path.join(dataDirPath, file);
    let dest = path.join(dataBackupDir, file);
    fs.copyFileSync(src, dest);
    console.debug(`file ${file} copy complete`);
}

console.debug('backup complete');

console.log('Starting data fetching using jisho api...');

fetchAll().then(() => {
    console.log('Data fetch complete...');
})