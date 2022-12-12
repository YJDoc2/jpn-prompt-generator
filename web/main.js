"use strict";
import * as utils from './utils.mjs'
import { getSelectionGrammarList, getSelectionWordList } from './dataHandler.mjs'
import { setMouseDown, setMouseUp } from './stateManager.mjs';

let date = new Date();
// seed to use in rng for the daily prompt
let dailySeed = new Date(date.getFullYear(), date.getMonth(), date.getDay()).getTime() / 1000;

// document element to show error messages
const errorPlaceholder = document.getElementById('errorPlaceholder');


window.onload = async () => {
    document.querySelector('#dark-mode-toggle').checked = false;
    // set initial mode if set in local storage
    if (JSON.parse(localStorage.getItem('darkMode'))) {
        document.querySelector('html').setAttribute('data-bs-theme', 'dark');
        document.querySelector('#dark-mode-toggle').checked = true;
    }

    document.querySelector('#dark-mode-toggle').onchange = (e) => {
        if (e.target.checked) {
            localStorage.setItem('darkMode', true);
            document.querySelector('html').setAttribute('data-bs-theme', 'dark');
        } else {
            localStorage.setItem('darkMode', false);
            document.querySelector('html').setAttribute('data-bs-theme', 'light');
        }
    }
    // fetch the data, now that page has loaded
    await utils.loadData();
    utils.populateListContents();

};

// validates carious input values
function validate() {
    utils.clearList(errorPlaceholder);
    let n5 = document.querySelector('#n5').checked;
    let n4 = document.querySelector('#n4').checked;

    if (!n5 && !n4) {
        throw 'Please select at least one vocab list';
    }

    let vcount = document.querySelector('#vocabCount').value;
    let gcount = document.querySelector('#grammarCount').value;

    if (1 > vcount || vcount > 10) {
        throw 'Please enter value between 1 - 10 for Vocab count';
    }

    if (1 > gcount || gcount > 10) {
        throw 'Please enter value between 1 - 10 for grammar count';
    }

    let lessonStart = document.querySelector('#lessonStart');
    let lessonEnd = document.querySelector('#lessonEnd');
    let from = parseInt(lessonStart.value);
    let upto = parseInt(lessonEnd.value);

    if (isNaN(from) || isNaN(upto)) {
        throw 'Set valid value for from and to lesson';
    }
    if (from > upto) {
        throw 'from lesson should be less than or equal to upto lesson';
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
        li.appendChild(document.createTextNode(`${point.text} : Lesson ${point.lesson}`));
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