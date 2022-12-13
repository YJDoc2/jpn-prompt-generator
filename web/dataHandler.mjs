import { getSelectedGrammar, getSelectedVocab } from "./stateManager.mjs";

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