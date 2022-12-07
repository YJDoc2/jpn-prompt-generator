
let n5Words = [];
let n4Words = [];

let genkiPoints = [];

let date = new Date();
// seed to use in rng for the daily prompt
let dailySeed = new Date(date.getFullYear(), date.getMonth(), date.getDay()).getTime() / 1000;

// document element to show error messages
const errorPlaceholder = document.getElementById('errorPlaceholder');


window.onload = async () => {
    document.querySelector('#dark-mode-toggle').checked = false;
    // set initial mode if set in local storage
    if (JSON.parse(localStorage.getItem('darkMode'))) {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("bg-light");
        document.querySelector('#dark-mode-toggle').checked = true;
    }

    document.querySelector('#dark-mode-toggle').onchange = (e) => {
        if (e.target.checked) {
            localStorage.setItem('darkMode', true);
            document.body.classList.add("dark-mode");
            document.body.classList.remove("bg-light");
        } else {
            localStorage.setItem('darkMode', false);
            document.body.classList.remove("dark-mode");
            document.body.classList.add("bg-light");
        }
    }
    // fetch the data, now that page has loaded
    await loadData();

};

function getSelectionWordList() {
    let ret = [];
    let n5 = document.querySelector('#n5').checked;
    let n4 = document.querySelector('#n4').checked;

    if (n5) {
        ret.push(...n5Words);
    }
    if (n4) {
        ret.push(...n4Words);
    }

    return ret;
}

function getSelectionGrammarList() {

    let lessonStart = document.querySelector('#lessonStart');
    let lessonEnd = document.querySelector('#lessonEnd');
    let from = parseInt(lessonStart.value);
    let upto = parseInt(lessonEnd.value);
    let selected = genkiPoints.filter((p) => {
        return from <= p.lesson && p.lesson <= upto
    });

    return selected;
}
// validates carious input values
function validate() {
    clearList(errorPlaceholder);
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
        showError(e, 'danger');
        return;
    }

    let vocabCount = document.querySelector('#vocabCount').value;
    let vocabList = document.querySelector('#vocabList');

    let grammarCount = document.querySelector('#grammarCount').value;
    let grammarList = document.querySelector('#grammarList');


    let selectionWordList = getSelectionWordList();
    let selectionGrammarList = getSelectionGrammarList();

    clearList(vocabList);
    clearList(grammarList);

    // as both of lists are large enough by themselves
    // that even small changes in random will blow up to different indices
    // we don't need to look out of duplicates. There will be duplicates
    // very rarely. This will need to implement the duplicate check if
    // custom lists are implemented
    for (let i = 0; i < vocabCount; i++) {
        let r = Math.floor((rand() * selectionWordList.length));
        let word = selectionWordList[r];
        let atag = document.createElement('a');
        atag.textContent = word.text;
        atag.href = word.jishoLink;
        atag.setAttribute('rel', 'noreferrer noopener');
        atag.setAttribute('target', '_blank');
        atag.setAttribute('class', 'list-group-item list');
        vocabList.appendChild(atag);
    }

    let set = new Set();
    for (let i = 0; i < grammarCount; i++) {
        let r = Math.floor((rand() * selectionGrammarList.length));
        let point = selectionGrammarList[r];

        // this avoids duplicates in case the available point selection is more than required point count
        if (set.has(point) && selectionGrammarList.length > grammarCount) {
            i--;
            continue;
        }

        set.add(point);
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item list');
        li.appendChild(document.createTextNode(`${point.text} : Lesson ${point.lesson}`));
        grammarList.appendChild(li);
    }
}

// to set "daily" random selections
// uses custom rng to get repeatable/ seeded random numbers
function daily() {
    let rand = mulberry32(dailySeed);
    setValues(rand);
}

// to set random selections each time clicked
function random() {
    setValues(Math.random);
}


// ------- Utility Functions -------------

const showError = (message, type) => {
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

async function loadData() {

    const updateData = await (await fetch('./data/lastUpdate.json')).json();
    const localData = JSON.parse(localStorage.getItem('updateData'));

    // we need to update data under following conditions :
    // 1. there is no data present in local storage (first time visiting)
    // 2. The updated time of data on server is different than what is present in local storage
    // 3. any of the 4 : n5 words, n4 words, grammar or updateData, is missing from the local storage
    // so we first check if local data is absent, then skip if and update the data,
    // otherwise check if any is missing and update the data, and finally check if timestamps are matching or not

    let updateNeeded = true;

    let WordList = JSON.parse(localStorage.getItem('WordList')) || {};
    let GrammarList = JSON.parse(localStorage.getItem('GrammarList')) || {};

    if (localData) {
        if (!WordList?.n5Words || !WordList?.n4Words || !GrammarList.genkiGrammar) {
            // yeah, we need to fetch
        } else if (localData.words === updateData.words && localData.grammar === updateData.grammar) {
            updateNeeded = false;
        }
    }

    if (updateNeeded) {
        // add opt, so store in the local storage, and update only if updated on server
        n5Words = await (await fetch('./data/n5Filtered.json')).json();
        n4Words = await (await fetch('./data/n4Filtered.json')).json();
        genkiPoints = await (await fetch('./data/genkiGrammarPoints.json')).json();

        WordList.n5Words = n5Words;
        WordList.n4Words = n4Words;
        GrammarList.genkiGrammar = genkiPoints;

        localStorage.setItem('WordList', JSON.stringify(WordList));
        localStorage.setItem('GrammarList', JSON.stringify(GrammarList));
        localStorage.setItem('updateData', JSON.stringify(updateData));
    } else {
        n5Words = WordList.n5Words;
        n4Words = WordList.n4Words;
        genkiPoints = GrammarList.genkiGrammar;
    }


}

// from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function clearList(elem) {
    // this is not particularly good way, but works
    let t = [];
    for (let c of elem.children) {
        t.push(c);
    }
    for (let c of t) {
        elem.removeChild(c);
    }
}
