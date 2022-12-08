"use strict";
import { setGrammarList, getGrammarList, getWordList, setWordList, setUpdateData, getUpdateData } from "./dataHandler.mjs";
import { addDragSelectBehavior, selectionEvent } from "./stateManager.mjs";


export function showError(message, type) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    clearList(errorPlaceholder);
    errorPlaceholder.append(wrapper);
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
        if (!wordList?.n5Words || !wordList?.n4Words || !grammarList.genkiGrammar) {
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

        wordList.n5Words = n5Words;
        wordList.n4Words = n4Words;
        grammarList.genkiGrammar = genkiPoints;

        setWordList(wordList);
        setGrammarList(grammarList);
        setUpdateData(updateData);
    }


}

// from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function clearList(elem) {
    // this is not particularly good way, but works
    let t = [];
    for (let c of elem.children) {
        t.push(c);
    }
    for (let c of t) {
        elem.removeChild(c);
    }

}


function getCheckboxUl(parentHeader, list) {
    let ul = document.createElement('ul');
    ul.classList = 'list-group';
    for (let header of Object.keys(list)) {
        let li = document.createElement('li');
        li.classList = 'list-group-item';
        li.style.userSelect = 'none';
        let div = document.createElement('div')
        div.classList = 'form-check'
        let check = document.createElement('input');
        check.type = 'checkbox';
        check.classList = 'form-check-input';
        check.id = `${parentHeader}-${header}-check`.replace(' ', '-');
        check.addEventListener('change', () => {
            selectionEvent(check, list[header], `${parentHeader}-${header}`);
        });
        li.addEventListener('mousedown', () => {
            check.checked = !check.checked;
            selectionEvent(check, list[header], `${parentHeader}-${header}`);
        })
        addDragSelectBehavior(check, li, list[header], `${parentHeader}-${header}`);
        let label = document.createElement('label');
        label.classList = 'form-check-label';
        label.setAttribute('for', check.id);
        label.textContent = header;
        div.appendChild(check);
        div.appendChild(label);
        li.appendChild(div);
        ul.appendChild(li);
    }
    return ul;
}

function getAccordionItem(header, contents, mainId) {
    let kbbHeader = header.replace(' ', '-');
    let itemDiv = document.createElement('div');
    itemDiv.classList = 'accordion-item';
    let h2 = document.createElement('h2');
    h2.classList = 'accordion-header';
    let btn = document.createElement('button');
    btn.classList = 'accordion-button collapsed';
    btn.type = 'button';
    btn.setAttribute('data-bs-toggle', 'collapse');
    btn.setAttribute('data-bs-target', `#${kbbHeader}-content`);
    btn.textContent = kbbHeader;
    h2.appendChild(btn);
    itemDiv.appendChild(h2);
    let dataDiv = document.createElement('div');
    dataDiv.classList = 'accordion-collapse collapse';
    dataDiv.setAttribute('data-bs-parent', `#${mainId}`);
    dataDiv.id = `${kbbHeader}-content`;
    let contentDiv = document.createElement('div');
    contentDiv.classList = 'accordion-body';
    let ul = getCheckboxUl(kbbHeader, contents);
    contentDiv.appendChild(ul);
    dataDiv.appendChild(contentDiv)
    itemDiv.appendChild(dataDiv);
    return itemDiv;

}

function getChapters(list) {
    let mapping = {};
    for (let item of list) {
        if (!mapping[item.lesson]) {
            mapping[item.lesson] = [];
        }
        mapping[item.lesson].push(item);
    }
    return mapping;
}

export function populateListContents() {

    let words = getWordList();
    let grammars = getGrammarList();

    let vocabPane = document.querySelector('#vocabPane');
    let grammarPane = document.querySelector('#grammarPane');
    vocabPane.innerHTML = '';
    grammarPane.innerHTML = '';

    let _div = document.createElement('div');
    _div.classList = 'container mt-2';
    let ul = getCheckboxUl('vocab', words);
    _div.appendChild(ul);
    vocabPane.appendChild(_div);

    _div = document.createElement('div');
    _div.classList = 'container mt-2';
    let accordionDiv = document.createElement('div');
    accordionDiv.classList = 'accordion';
    accordionDiv.id = 'grammarAccordion';
    for (let key of Object.keys(grammars)) {
        let chapters = getChapters(grammars[key]);
        let item = getAccordionItem(key, chapters, 'grammarAccordion');
        accordionDiv.appendChild(item);
    }
    _div.appendChild(accordionDiv);
    grammarPane.appendChild(_div);
}