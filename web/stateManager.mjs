let mouseDown = false;
let selectedVocab = new Set();
let selectedGrammar = new Set();
let checkboxes = {};

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