"use strict";
import * as utils from './utils.mjs'
import { addUploadedGrammarData, addUploadedVocabData, getSelectionGrammarList, getSelectionVocabList, saveSelectedData, validateGrammarData, validateVocabData } from './dataHandler.mjs'
import { getSelectedGrammar, getSelectedVocab, initState, setMouseDown, setMouseUp, clearSelection } from './stateManager.mjs';

let date = new Date();
// seed to use in rng for the daily prompt
let dailySeed = new Date(date.getFullYear(), date.getMonth(), date.getDay()).getTime() / 1000;

// document element to show error messages
const errorPlaceholder = document.getElementById('errorPlaceholder');

window.addEventListener('load', async () => {
    await initState();
});

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


    let selectionVocabList = getSelectionVocabList();
    let selectionGrammarList = getSelectionGrammarList();

    let infoDiv = document.querySelector('#infoPlaceholder');
    utils.clearList(infoDiv);

    utils.clearList(vocabList);
    utils.clearList(grammarList);

    let temp = new Set();
    for (let i = 0; i < vocabCount; i++) {
        let r = Math.floor((rand() * selectionVocabList.length));
        let word = selectionVocabList[r];

        // this avoids duplicates in case the available point selection is more than required point count
        if (temp.has(word) && selectionVocabList.length > vocabCount) {
            i--;
            continue;
        }

        temp.add(word);

        let infoBtn = document.createElement('button');
        infoBtn.classList = "btn col col-2 bi bi-info-circle";
        infoBtn.style = 'font-size: 1.2rem; color: cornflowerblue;';
        infoBtn.addEventListener('click', () => {
            utils.clearList(infoDiv);

            // the 'Word : word' part
            let span = document.createElement('span');
            span.textContent = 'Word : ';
            span.classList = 'list-group-item';

            // actual word, linked to Jisho
            let a = document.createElement('a');

            a.textContent = word.text;
            a.href = word.jishoLink ? word.jishoLink : `https://jisho.org/search/${word.text}`;
            a.setAttribute('rel', 'noreferrer noopener');
            a.setAttribute('target', '_blank');
            span.appendChild(a);

            infoDiv.appendChild(span);

            // the set from which it came from
            span = document.createElement('span');
            span.classList = 'list-group-item';
            span.textContent = `From : ${word.meta.source}`;

            infoDiv.appendChild(span);
        });

        let rowDiv = document.createElement('div');
        rowDiv.classList = 'row';

        let li = document.createElement('li');
        li.classList = 'list-group-item';

        let atag = document.createElement('a');

        atag.textContent = word.text;
        atag.href = word.jishoLink ? word.jishoLink : `https://jisho.org/search/${word.text}`;
        atag.setAttribute('rel', 'noreferrer noopener');
        atag.setAttribute('target', '_blank');

        // no underscore, color according to parent/theme
        atag.style = 'text-decoration:none; color:inherit;'
        atag.classList = 'col col-10';

        rowDiv.appendChild(atag);
        rowDiv.appendChild(infoBtn);
        li.appendChild(rowDiv);

        vocabList.appendChild(li);
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

        let infoBtn = document.createElement('button');
        infoBtn.classList = "btn col col-2 bi bi-info-circle";
        infoBtn.style = 'font-size: 1.2rem; color: cornflowerblue;';

        infoBtn.addEventListener('click', () => {
            utils.clearList(infoDiv);

            // the 'Point : point' part
            let span = document.createElement('span');
            span.classList = 'list-group-item';
            span.textContent = `Point : ${point.text}`;
            infoDiv.appendChild(span);

            // the set from which it came
            span = document.createElement('span');
            span.classList = 'list-group-item';
            span.textContent = `From : ${point.meta.source}`;
            infoDiv.appendChild(span);

            if (point.links && point.links.length > 0) {
                let span = document.createElement('span');
                span.classList = 'list-group-item';
                span.appendChild(document.createTextNode('Links : '));
                for (let link of point.links) {
                    let a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.title;
                    a.classList = 'mx-2';
                    a.setAttribute('rel', 'noreferrer noopener');
                    a.setAttribute('target', '_blank');
                    span.appendChild(a);
                }
                infoDiv.appendChild(span);
            }


        })

        let rowDiv = document.createElement('div');
        rowDiv.classList = 'row';

        let span = document.createElement('span');
        span.textContent = point.text;
        span.classList = 'col col-10';


        rowDiv.appendChild(span);
        rowDiv.appendChild(infoBtn);

        let li = document.createElement('li');
        li.classList = 'list-group-item'

        li.appendChild(rowDiv);

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

document.querySelector('#btnUpload').addEventListener('click', async () => {
    let fileInput = document.querySelector('#dataFileInput');
    let file = fileInput.files[0];
    let title = document.querySelector('#dataNameInput').value.trim();
    if (title.length === 0) {
        utils.setDataFileError('No title Set');
        return;
    }
    if (!file) {
        utils.setDataFileError('No file uploaded');
        return;
    }
    if (file.type !== 'application/json') {
        utils.setDataFileError('Invalid File Type. Only JSON files are supported');
        return;
    }
    let fileData = null;
    try {
        fileData = JSON.parse(await file.text());
    } catch (e) {
        utils.setDataFileError('Error in parsing uploaded file , see console for details');
        console.error(e);
        return;
    }

    let type = document.querySelector("input[name='typeRadios']:checked").value;
    try {
        if (type === 'vocab') {
            validateVocabData(title, fileData);
            addUploadedVocabData(title, fileData);
        } else {
            validateGrammarData(title, fileData);
            addUploadedGrammarData(title, fileData);
        }
    } catch (e) {
        utils.setDataFileError(e);
        return;
    }



    fileInput.value = '';
    document.querySelector('#dataNameInput').value = '';


    let modalElement = document.querySelector('#dataUploadModal');
    let modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
})