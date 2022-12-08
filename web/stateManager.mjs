const enteredList = {};

let mouseDown = false;
let selectedVocab = new Set();
let selectedGrammar = new Set();
let selectedVocabData = new Set();
let selectedGrammarData = new Set();


export function setMouseDown() {
    mouseDown = true;
}

export function setMouseUp() {
    mouseDown = false;
}

export function isMouseDown() {
    return mouseDown;
}

export function addDragSelectBehavior(check, li, data, header) {
    if (!enteredList[check.id]) {
        enteredList[check.id] = false;
    }

    li.addEventListener('mouseenter', (e) => {
        if (isMouseDown()) {
            check.checked = !check.checked;
            selectionEvent(check, data, header);
        }
        enteredList[check.id] = true;
    });
    li.addEventListener('mouseleave', () => {
        enteredList[check.id] = false;
    });
}

export function selectionEvent(check, data, header) {
    let dataList = check.id.startsWith('vocab') ? selectedVocabData : selectedGrammarData;
    let selected = check.id.startsWith('vocab') ? selectedVocab : selectedGrammar;
    if (check.checked) {
        dataList.add(data);
        selected.add(header);
    } else {
        dataList.delete(data);
        selected.delete(header);
    }
    displaySelection();
}

function displaySelection() {
    let vocab = document.querySelector('#selectedVocab');
    let grammar = document.querySelector('#selectedGrammar');

    vocab.textContent = JSON.stringify(Array.from(selectedVocab));
    grammar.textContent = JSON.stringify(Array.from(selectedGrammar));
}