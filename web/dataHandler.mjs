"use strict";
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

export function getSelectionWordList() {
    let words = getWordList();
    let n5Words = words.n5Words;
    let n4Words = words.n4Words;

    let ret = [];

    let n5 = document.querySelector('#n5').checked;
    let n4 = document.querySelector('#n4').checked;

    if (n5) {
        ret.push(...n5Words);
    }
    if (n4) {
        ret.push(...n4Words);
    }

    return ret;
}

export function getSelectionGrammarList() {

    let grammar = getGrammarList();
    let genkiPoints = grammar.genkiGrammar;

    let lessonStart = document.querySelector('#lessonStart');
    let lessonEnd = document.querySelector('#lessonEnd');
    let from = parseInt(lessonStart.value);
    let upto = parseInt(lessonEnd.value);
    let selected = genkiPoints.filter((p) => {
        return from <= p.lesson && p.lesson <= upto
    });

    return selected;
}