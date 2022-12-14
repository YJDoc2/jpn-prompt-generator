"use strict";
import { setGrammarList, getGrammarList, getWordList, setWordList, setUpdateData, getUpdateData, addIdPointMapping, getDataPoint } from "./dataHandler.mjs";
import { addIdCheckboxMapping, addDragSelectBehavior, selectionEvent } from "./stateManager.mjs";


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


function getCheckboxUl(list) {
    let ul = document.createElement('ul');
    ul.classList = 'list-group';

    for (let point of list) {
        let li = document.createElement('li');
        li.classList = 'list-group-item';
        li.style.userSelect = 'none';

        let div = document.createElement('div')
        div.classList = 'form-check'

        let check = document.createElement('input');
        check.type = 'checkbox';
        check.classList = 'form-check-input';
        check.id = point.meta.id;

        addIdCheckboxMapping(check.id, check);

        let label = document.createElement('label');
        label.classList = 'form-check-label';
        label.setAttribute('for', check.id);
        label.textContent = point.title;

        div.appendChild(check);
        div.appendChild(label);
        li.appendChild(div);
        ul.appendChild(li);

        check.addEventListener('click', (e) => {
            /* Ignore this here, it is handled in li event listener */
            e.preventDefault();
        });

        li.addEventListener('mousedown', () => {
            // this will handle clicking anywhere in the whole li
            // including the text label and checkbox itself
            check.checked = !check.checked;
            selectionEvent(check);
        });

        addDragSelectBehavior(check, li);
    }
    return ul;
}

function getAccordionItem(header, contents, mainId) {

    let kbbHeader = getId(header);

    let itemDiv = document.createElement('div');
    itemDiv.classList = 'accordion-item';

    let h2 = document.createElement('h2');
    h2.classList = 'accordion-header';

    let btn = document.createElement('button');
    btn.classList = 'accordion-button collapsed';
    btn.type = 'button';
    btn.setAttribute('data-bs-toggle', 'collapse');
    btn.setAttribute('data-bs-target', `#${kbbHeader}-content`);
    btn.textContent = header;

    h2.appendChild(btn);
    itemDiv.appendChild(h2);

    let dataDiv = document.createElement('div');
    dataDiv.classList = 'accordion-collapse collapse';
    dataDiv.setAttribute('data-bs-parent', `#${mainId}`);
    dataDiv.id = `${kbbHeader}-content`;

    let contentDiv = document.createElement('div');
    contentDiv.classList = 'accordion-body';

    let ul = getCheckboxUl(contents);

    contentDiv.appendChild(ul);
    dataDiv.appendChild(contentDiv)
    itemDiv.appendChild(dataDiv);

    return itemDiv;
}

export function populateListContents() {

    let words = getWordList();
    let grammars = getGrammarList();

    let vocabPane = document.querySelector('#vocabPane');
    let grammarPane = document.querySelector('#grammarPane');
    vocabPane.innerHTML = '';
    grammarPane.innerHTML = '';

    let _div = document.createElement('div');
    _div.classList = 'container my-2';
    let ul = getCheckboxUl(Object.keys(words).map((k) => words[k]));
    _div.appendChild(ul);
    vocabPane.appendChild(_div);

    _div = document.createElement('div');
    _div.classList = 'container my-2';
    let accordionDiv = document.createElement('div');
    accordionDiv.classList = 'accordion';
    accordionDiv.id = 'grammarAccordion';
    for (let key of Object.keys(grammars)) {
        let chapters = grammars[key].data;
        let item = getAccordionItem(grammars[key].title, chapters, 'grammarAccordion');
        accordionDiv.appendChild(item);
    }
    _div.appendChild(accordionDiv);
    grammarPane.appendChild(_div);
}

export function getId(...strings) {
    return strings.map((s) => s.replaceAll(' ', '-').replaceAll('_', '-')).join('_')
}

export function setDataFileError(err) {
    document.querySelector('#dataErrorPlaceholder').textContent = err;
}