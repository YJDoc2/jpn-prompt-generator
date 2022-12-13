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

// Drag select behavior is supposed to handle
// when user clicks in an li and drags it through 
// several others, all must get their state inverted
export function addDragSelectBehavior(check, li) {

    li.addEventListener('mouseenter', (e) => {
        // if mouse is inside and clicked
        // then invert the state
        if (isMouseDown()) {
            check.checked = !check.checked;
            selectionEvent(check, li.textContent);
        }
    });
}

export function selectionEvent(check, title) {
    let dataList = check.id.startsWith('vocab') ? selectedVocabData : selectedGrammarData;
    let selected = check.id.startsWith('vocab') ? selectedVocab : selectedGrammar;
    if (check.checked) {
        dataList.add(title);
        selected.add(check.id);
    } else {
        dataList.delete(title);
        selected.delete(check.id);
    }
    displaySelection();
}

function displaySelection() {
    let vocab = document.querySelector('#selectedVocab');
    let grammar = document.querySelector('#selectedGrammar');

    vocab.textContent = JSON.stringify(Array.from(selectedVocab));
    grammar.textContent = JSON.stringify(Array.from(selectedGrammar));
}