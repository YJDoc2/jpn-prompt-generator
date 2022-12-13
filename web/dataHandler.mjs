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


        n5Words.id = getId('vocab', n5Words.title);
        n4Words.id = getId('vocab', n4Words.title);
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
        addIdPointMapping(wordSet.id, wordSet.data);
    }

    for (let key of Object.keys(grammarList)) {
        let grammar = grammarList[key];
        for (let chapter of grammar.data) {
            addIdPointMapping(chapter.id, chapter.points);
        }
    }
}

function setGrammarId(data) {
    let title = data.title;
    for (let point of data.data) {
        point.id = getId('grammar', title, point.title);
    }
}