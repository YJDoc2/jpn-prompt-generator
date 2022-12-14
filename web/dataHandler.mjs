import { getSelectedGrammar, getSelectedVocab } from "./stateManager.mjs";
import { getId, } from "./utils.mjs";

let dataMap = {};

export function setWordList(newList) {
    localStorage.setItem('WordList', JSON.stringify(newList));
}
export function getWordList() {
    return JSON.parse(localStorage.getItem('WordList')) || {}
}

export function setGrammarList(newList) {
    localStorage.setItem('GrammarList', JSON.stringify(newList));
}
export function getGrammarList() {
    return JSON.parse(localStorage.getItem('GrammarList')) || {};
}

export function setUpdateData(data) {
    localStorage.setItem('updateData', JSON.stringify(data));
}
export function getUpdateData() {
    return JSON.parse(localStorage.getItem('updateData')) || {};
}

export function saveSelectedData() {
    let vocab = getSelectedVocab();
    let grammar = getSelectedGrammar();
    localStorage.setItem('selectedData', JSON.stringify({ vocab, grammar }));
}

export function getSelectedData() {
    return JSON.parse(localStorage.getItem('selectedData')) || {};
}


export function addIdPointMapping(id, data) {
    dataMap[id] = data
}

export function getDataPoint(id) {
    return dataMap[id];
}

export function getSelectionWordList() {
    let vocab = getSelectedVocab();
    let ret = [];
    for (let id of vocab) {
        let points = dataMap[id];
        if (points) {
            ret.push(...points);
        }
    }
    return ret;
}

export function getSelectionGrammarList() {

    let grammar = getSelectedGrammar();
    let selected = [];
    for (let id of grammar) {
        let data = dataMap[id];
        if (data) {
            selected.push(...data);
        }
    }
    return selected;
}

export async function loadData() {
    const updateData = await (await fetch('./data/lastUpdate.json')).json();
    const localData = getUpdateData()

    // we need to update data under following conditions :
    // 1. there is no data present in local storage (first time visiting)
    // 2. The updated time of data on server is different than what is present in local storage
    // 3. any of the 4 : n5 words, n4 words, grammar or updateData, is missing from the local storage
    // so we first check if local data is absent, then skip if and update the data,
    // otherwise check if any is missing and update the data, and finally check if timestamps are matching or not

    let updateNeeded = true;

    let wordList = getWordList();
    let grammarList = getGrammarList();

    if (localData) {
        if (!wordList?.n5Words || !wordList?.n4Words || !grammarList?.genkiGrammar) {
            // yeah, we need to fetch
        } else if (localData.words === updateData.words && localData.grammar === updateData.grammar) {
            updateNeeded = false;
        }
    }

    if (updateNeeded) {
        // add opt, so store in the local storage, and update only if updated on server
        let n5Words = await (await fetch('./data/n5Filtered.json')).json();
        let n4Words = await (await fetch('./data/n4Filtered.json')).json();
        let genkiPoints = await (await fetch('./data/genkiGrammarPoints.json')).json();


        n5Words.meta = { id: getId('vocab', n5Words.title) };
        n4Words.meta = { id: getId('vocab', n4Words.title) };
        setGrammarId(genkiPoints);

        wordList.n5Words = n5Words;
        wordList.n4Words = n4Words;
        grammarList.genkiGrammar = genkiPoints;

        setWordList(wordList);
        setGrammarList(grammarList);
        setUpdateData(updateData);
    }

    wordList = getWordList();
    grammarList = getGrammarList();

    for (let key of Object.keys(wordList)) {
        let wordSet = wordList[key];
        addIdPointMapping(wordSet.meta.id, wordSet.data);
    }

    for (let key of Object.keys(grammarList)) {
        let grammar = grammarList[key];
        for (let chapter of grammar.data) {
            addIdPointMapping(chapter.meta.id, chapter.points);
        }
    }
}

function setGrammarId(data) {
    let title = data.title;
    for (let point of data.data) {
        point.meta = { id: getId('grammar', title, point.title) };
    }
}

export function validateVocabData(title, data) {
    let vdata = getWordList();
    for (let v of Object.keys(vdata)) {
        if (vdata[v].title === title) {
            throw `Title '${title}' already exists. Please enter a different title.`
        }
    }
    if (!Array.isArray(data)) {
        throw 'Data must be an array, as per the data scheme.'
    }
    for (let word of data) {
        if (!word.text || typeof word.text !== 'string') {
            throw `Attribute 'text' must be present and a string : Error in word \n${JSON.stringify(word, null, 2)}`;
        }
    }
}

export function validateGrammarData(title, data) {
    let gdata = getGrammarList();
    for (let g of Object.keys(gdata)) {
        if (gdata[g].title === title) {
            throw `Title '${title}' already exists. Please enter a different title.`
        }
    }
    if (!Array.isArray(data)) {
        throw 'Data must be an array, as per the data scheme.'
    }
    for (let chapter of data) {
        if (!chapter.title || typeof chapter.title !== 'string') {
            throw `Attribute 'title' must be present and a string : Error in chapter \n${JSON.stringify(chapter, null, 2)}`;
        }
        if (!chapter.points || !Array.isArray(chapter.points)) {
            throw `Attribute 'points' must be present and an array : Error in chapter \n${JSON.stringify(chapter, null, 2)}`;
        }
        if (chapter.points.length < 1) {
            throw `Attribute 'points' array is empty : Error in chapter \n${JSON.stringify(chapter, null, 2)}`;
        }
        for (let point of chapter.points) {
            if (typeof point === 'string') {
                // a point can be just a string
                continue;
            }
            if (!point.text || typeof point.text !== 'string') {
                throw `Attribute 'text' must be present and a string : Error in point \n${JSON.stringify(point, null, 2)}`;
            }
            if (point.links) {
                if (!Array.isArray(point.links)) {
                    throw `Attribute 'link', if present, must an array : Error in point \n${JSON.stringify(point, null, 2)}`;
                }
                if (point.links.length < 1) {
                    throw `Attribute 'link' array is empty : Error in point \n${JSON.stringify(point, null, 2)}`;
                }
                for (let link of point.links) {
                    if (!link.title || typeof link.title !== 'string') {
                        throw `Attribute 'title' must be present in link object, and must a string : Error in point \n${JSON.stringify(point, null, 2)}`;
                    }
                    if (!link.url || typeof link.url !== 'string') {
                        throw `Attribute 'url' must be present in link object, and must a string : Error in point \n${JSON.stringify(point, null, 2)}`;
                    }
                }
            }
        }
    }
}

export function addUploadedVocabData(data) { }

export function addUploadedGrammarData(data) { }