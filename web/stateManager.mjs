import { loadData, getSelectedData } from "./dataHandler.mjs";
import { populateListContents } from "./utils.mjs";

let mouseDown = false;
let selectedVocab = new Set();
let selectedGrammar = new Set();
let checkboxes = {};


export async function initState() {

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

    await loadData();
    populateListContents();

    let { vocab, grammar } = getSelectedData();
    if (vocab) {
        selectedVocab = new Set(vocab);
        for (let v of vocab) {
            let check = getCheckbox(v);
            if (check) {
                check.checked = true;
            }
        }
    }
    if (grammar) {
        selectedGrammar = new Set(grammar);
        for (let g of grammar) {
            let check = getCheckbox(g);
            if (check) {
                check.checked = true;
            }
        }
    }
}

export function setMouseDown() {
    mouseDown = true;
}

export function setMouseUp() {
    mouseDown = false;
}

export function isMouseDown() {
    return mouseDown;
}

// Drag select behavior is supposed to handle
// when user clicks in an li and drags it through 
// several others, all must get their state inverted
export function addDragSelectBehavior(check, li) {

    li.addEventListener('mouseenter', (e) => {
        // if mouse is inside and clicked
        // then invert the state
        if (isMouseDown()) {
            check.checked = !check.checked;
            selectionEvent(check);
        }
    });
}

export function selectionEvent(check) {
    let selected = check.id.startsWith('vocab') ? selectedVocab : selectedGrammar;
    if (check.checked) {
        selected.add(check.id);
    } else {
        selected.delete(check.id);
    }

}

export function addIdCheckboxMapping(id, check) {
    checkboxes[id] = check;
}

export function getCheckbox(id) {
    return checkboxes[id];
}

export function getSelectedVocab() {
    return Array.from(selectedVocab);
}

export function getSelectedGrammar() {
    return Array.from(selectedGrammar);
}