const path = require('path');
const fs = require('fs');

const jishoBaseLink = 'https://jisho.org/search/';

if(!process.argv[1]){
    console.error('Please give data directory path...');
    console.error('Syntax : node index /data/dir/path');
    process.exit(1);
}

const dataDirPath = path.resolve(process.argv[2]);

if(!fs.existsSync(dataDirPath)){
    console.error(`Given path of data directory ${dataDirPath} does not exist...`);
    console.error('Please give correct path');
    process.exit(1);
}

console.log('starting ...');

// need a better way of handling this, but should work for now

const n5path = path.join(dataDirPath,'n5.json');
const n4path = path.join(dataDirPath,'n4.json');

const n5 = require(n5path);
const n4 = require(n4path);

if(!n5){
    console.error(`data file n5.json not found at ${n5path}`);
    process.exit(1);
}

if(!n4){
    console.error(`data file n4.json not found at ${n4path}`);
    process.exit(1);
}

console.debug('starting filtering n5...');

let n5Filtered = [];

for(let word of n5.data){
    n5Filtered.push({
        text:word.slug,
        jishoLink:`${jishoBaseLink}${word.slug}`,
        attribution:word.attribution
    });
}

console.debug('n5 filtering complte');

console.debug('starting filtering n4...');
let n4Filtered = [];

for(let word of n4.data){
    n4Filtered.push({
        text:word.slug,
        jishoLink:`${jishoBaseLink}${word.slug}`,
        attribution:word.attribution
    });
}

console.debug('n4 filtering complte');

console.debug('writing data to files');
fs.writeFileSync(path.join(dataDirPath,'n5Filtered.json'),JSON.stringify(n5Filtered));
fs.writeFileSync(path.join(dataDirPath,'n4Filtered.json'),JSON.stringify(n4Filtered));
console.debug('data writing complete');

console.log('filtering complete');