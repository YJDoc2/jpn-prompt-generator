"use strict";
import * as utils from './utils.mjs'
import { getSelectionGrammarList, getSelectionWordList, saveSelectedData } from './dataHandler.mjs'
import { getSelectedGrammar, getSelectedVocab, initState, setMouseDown, setMouseUp, clearSelection } from './stateManager.mjs';

let date = new Date();
// seed to use in rng for the daily prompt
let dailySeed = new Date(date.getFullYear(), date.getMonth(), date.getDay()).getTime() / 1000;

// document element to show error messages
const errorPlaceholder = document.getElementById('errorPlaceholder');


window.onload = async () => {

    await initState();

};

// validates carious input values
function validate() {
    utils.clearList(errorPlaceholder);

    let vocabList = getSelectedVocab();
    if (vocabList.length < 1) {
        throw 'Please select at least one Vocab list';
    }

    let grammarList = getSelectedGrammar();
    if (grammarList.length < 1) {
        throw 'Please select at least one Grammar point';
    }

    let vcount = document.querySelector('#vocabCount').value;
    let gcount = document.querySelector('#grammarCount').value;

    if (1 > vcount || vcount > 10) {
        throw 'Please enter value between 1 - 10 for Vocab count';
    }

    if (1 > gcount || gcount > 10) {
        throw 'Please enter value between 1 - 10 for grammar count';
    }

    return;
}

function setValues(rand) {

    try {
        validate();
    } catch (e) {
        utils.showError(e, 'danger');
        return;
    }

    let vocabCount = document.querySelector('#vocabCount').value;
    let vocabList = document.querySelector('#vocabList');

    let grammarCount = document.querySelector('#grammarCount').value;
    let grammarList = document.querySelector('#grammarList');


    let selectionWordList = getSelectionWordList();
    let selectionGrammarList = getSelectionGrammarList();

    utils.clearList(vocabList);
    utils.clearList(grammarList);

    let temp = new Set();
    for (let i = 0; i < vocabCount; i++) {
        let r = Math.floor((rand() * selectionWordList.length));
        let word = selectionWordList[r];

        // this avoids duplicates in case the available point selection is more than required point count
        if (temp.has(word) && selectionWordList.length > vocabCount) {
            i--;
            continue;
        }
        temp.add(word);
        let atag = document.createElement('a');
        atag.textContent = word.text;
        atag.href = word.jishoLink;
        atag.setAttribute('rel', 'noreferrer noopener');
        atag.setAttribute('target', '_blank');
        atag.setAttribute('class', 'list-group-item list');
        vocabList.appendChild(atag);
    }

    temp = new Set();
    for (let i = 0; i < grammarCount; i++) {
        let r = Math.floor((rand() * selectionGrammarList.length));
        let point = selectionGrammarList[r];

        // this avoids duplicates in case the available point selection is more than required point count
        if (temp.has(point) && selectionGrammarList.length > grammarCount) {
            i--;
            continue;
        }

        temp.add(point);
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item list');
        li.appendChild(document.createTextNode(point.title));
        grammarList.appendChild(li);
    }
}

// to set "daily" random selections
// uses custom rng to get repeatable/ seeded random numbers
export function daily() {
    let rand = utils.mulberry32(dailySeed);
    setValues(rand);
}

// to set random selections each time clicked
export function random() {
    setValues(Math.random);
}

document.querySelector('#btnDaily').addEventListener('click', daily);
document.querySelector('#btnRandom').addEventListener('click', random);


document.addEventListener('mousedown', () => {
    setMouseDown();
});

document.addEventListener('mouseup', () => {
    setMouseUp();
});

document.querySelector('#dataSelectModal').addEventListener('hidden.bs.modal', () => {
    saveSelectedData();
});

document.querySelector('#btnClearSelection').addEventListener('click', () => {
    clearSelection();
});