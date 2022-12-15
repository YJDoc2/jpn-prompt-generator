import { getGrammarList, getVocabList } from "./dataHandler.mjs";
import { initDarkModeState } from "./stateManager.mjs";

window.onload = () => {
    initDarkModeState();
    initUI();
}

function createLi(set) {
    let li = document.createElement('li');
    li.classList = 'list-group-item w-50';
    let div = document.createElement('div');
    div.classList = 'row'
    let span = document.createElement('span');
    span.style = 'align-self:center;'
    span.classList = 'col col-8';
    span.textContent = set.title;
    div.appendChild(span);

    let downloadIcon = document.createElement('btn');
    downloadIcon.classList = 'btn col col-2 bi bi-file-earmark-arrow-down'
    downloadIcon.style = 'font-size: 1.2rem; color: cornflowerblue;';

    div.appendChild(downloadIcon);

    let deleteIcon = document.createElement('btn');
    deleteIcon.classList = 'btn col col-2 bi bi-trash3-fill'
    deleteIcon.style = 'font-size: 1.2rem; color: red;';
    div.appendChild(deleteIcon);
    li.appendChild(div);
    return li;
}

function initUI() {
    let vocabUl = document.querySelector('#vocabSetUl');
    let grammarUl = document.querySelector('#grammarSetUl');
    let vocabList = getVocabList();
    let grammarList = getGrammarList();
    for (let v of Object.keys(vocabList)) {
        let set = vocabList[v];
        vocabUl.appendChild(createLi(set));
    }

    for (let g of Object.keys(grammarList)) {
        let set = grammarList[g];
        grammarUl.appendChild(createLi(set));
    }
}