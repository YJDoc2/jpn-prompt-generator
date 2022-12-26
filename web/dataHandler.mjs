import { getSelectedGrammar, getSelectedVocab, refreshLists } from "./stateManager.mjs";
import { getId, } from "./utils.mjs";

let dataMap = {};

export function setVocabList(newList) {
    localStorage.setItem('VocabList', JSON.stringify(newList));
}
export function getVocabList() {
    return JSON.parse(localStorage.getItem('VocabList')) || {}
}

export function setGrammarList(newList) {
    localStorage.setItem('GrammarList', JSON.stringify(newList));
}
export function getGrammarList() {
    return JSON.parse(localStorage.getItem('GrammarList')) || {};
}

export function setUpdateData(data) {
    localStorage.setItem('updateData', JSON.stringify(data));
}
export function getUpdateData() {
    return JSON.parse(localStorage.getItem('updateData')) || {};
}

export function saveSelectedData(data) {
    let vocab = null;
    let grammar = null;
    if (!data) {
        vocab = getSelectedVocab();
        grammar = getSelectedGrammar();
    } else {
        ({ vocab, grammar } = data);
    }
    localStorage.setItem('selectedData', JSON.stringify({ vocab, grammar }));
}

export function getSelectedData() {
    return JSON.parse(localStorage.getItem('selectedData')) || {};
}


export function addIdPointMapping(id, data, source) {
    dataMap[id] = { data, source };
}

export function getSelectionVocabList() {
    let vocab = getSelectedVocab();
    let ret = [];
    for (let id of vocab) {
        let { data, source } = dataMap[id];
        if (data) {
            data.forEach((w) => w.meta = { source });
            ret.push(...data);
        }
    }
    return ret;
}

export function getSelectionGrammarList() {

    let grammar = getSelectedGrammar();
    let selected = [];
    for (let id of grammar) {
        let { data, source } = dataMap[id];
        if (data) {
            data.forEach((p) => p.meta = { source });
            selected.push(...data);
        }
    }
    return selected;
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

    let vocabList = getVocabList();
    let grammarList = getGrammarList();

    if (localData) {
        if (!vocabList?.n5Words || !vocabList?.n4Words || !grammarList?.genkiGrammar) {
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

        setVocabId(n5Words);
        setVocabId(n4Words);
        setGrammarId(genkiPoints);

        vocabList.n5Words = n5Words;
        vocabList.n4Words = n4Words;
        grammarList.genkiGrammar = genkiPoints;

        setVocabList(vocabList);
        setGrammarList(grammarList);
        setUpdateData(updateData);
    }

    vocabList = getVocabList();
    grammarList = getGrammarList();

    for (let key of Object.keys(vocabList)) {
        let wordSet = vocabList[key];
        addIdPointMapping(wordSet.meta.id, wordSet.data, wordSet.title);
    }

    for (let key of Object.keys(grammarList)) {
        let grammar = grammarList[key];
        for (let chapter of grammar.data) {
            addIdPointMapping(chapter.meta.id, chapter.points, `${grammar.title} > ${chapter.title}`);
        }
    }
}

function setGrammarId(data) {
    let title = data.title;
    for (let chapter of data.data) {
        chapter.meta = { id: getId('grammar', title, chapter.title) };
    }
}

function setVocabId(data) {
    data.meta = { id: getId('vocab', data.title) };
}

export function validateVocabData(title, data) {
    let vdata = getVocabList();
    for (let v of Object.keys(vdata)) {
        if (vdata[v].title === title) {
            throw `Title '${title}' already exists. Please enter a different title.`
        }
    }
    if (!Array.isArray(data)) {
        throw 'Data must be an array, as per the data scheme.'
    }
    for (let word of data) {
        if (!word.text || typeof word.text !== 'string') {
            throw `Attribute 'text' must be present and a string : Error in word \n${JSON.stringify(word, null, 2)}`;
        }
        if (word.jishoLink && typeof word.jishoLink !== 'string') {
            throw `Attribute 'jishoLink', if present, must be of type string : Error in word \n${JSON.stringify(word, null, 2)}`;
        }
    }
}

export function validateGrammarData(title, data) {
    let gdata = getGrammarList();
    for (let g of Object.keys(gdata)) {
        if (gdata[g].title === title) {
            throw `Title '${title}' already exists. Please enter a different title.`
        }
    }
    if (!Array.isArray(data)) {
        throw 'Data must be an array, as per the data scheme.'
    }
    for (let chapter of data) {
        if (!chapter.title || typeof chapter.title !== 'string') {
            throw `Attribute 'title' must be present and a string : Error in chapter \n${JSON.stringify(chapter, null, 2)}`;
        }
        if (!chapter.points || !Array.isArray(chapter.points)) {
            throw `Attribute 'points' must be present and an array : Error in chapter \n${JSON.stringify(chapter, null, 2)}`;
        }
        if (chapter.points.length < 1) {
            throw `Attribute 'points' array is empty : Error in chapter \n${JSON.stringify(chapter, null, 2)}`;
        }
        for (let point of chapter.points) {
            if (typeof point === 'string') {
                // a point can be just a string
                continue;
            }
            if (!point.text || typeof point.text !== 'string') {
                throw `Attribute 'text' must be present and a string : Error in point \n${JSON.stringify(point, null, 2)}`;
            }
            if (point.links) {
                if (!Array.isArray(point.links)) {
                    throw `Attribute 'link', if present, must an array : Error in point \n${JSON.stringify(point, null, 2)}`;
                }
                if (point.links.length < 1) {
                    throw `Attribute 'link' array is empty : Error in point \n${JSON.stringify(point, null, 2)}`;
                }
                for (let link of point.links) {
                    if (!link.title || typeof link.title !== 'string') {
                        throw `Attribute 'title' must be present in link object, and must a string : Error in point \n${JSON.stringify(point, null, 2)}`;
                    }
                    if (!link.url || typeof link.url !== 'string') {
                        throw `Attribute 'url' must be present in link object, and must a string : Error in point \n${JSON.stringify(point, null, 2)}`;
                    }
                }
            }
        }
    }
}

export function addUploadedVocabData(title, data) {
    let vocabSet = {};
    vocabSet.title = title;
    let words = [];
    for (let p of data) {
        let w = {};
        w.text = p.text;
        if (p.jishoLink) {
            w.jishoLink = p.jishoLink;
        }
        if (p.attribution) {
            w.attribution = p.attribution;
        } else {
            w.attribution = {};
        }
        words.push(w);
    }
    vocabSet.data = words;
    setVocabId(vocabSet);

    let vocabs = getVocabList();
    let id = getId('vocab', title);
    vocabs[id] = vocabSet;

    setVocabList(vocabs);

    vocabSet.meta
    addIdPointMapping(vocabSet.meta.id, vocabSet.data, title);

    refreshLists();

}

export function addUploadedGrammarData(title, data) {
    let grammarSet = {};
    grammarSet.title = title;
    let chapters = [];
    for (let c of data) {
        let chapter = {};
        chapter.title = c.title;
        let points = [];
        for (let p of c.points) {
            if (typeof p === 'string') {
                points.push({
                    text: p,
                    links: []
                });
            } else {
                points.push({
                    text: p.text,
                    links: p.links || []
                })
            }
        }
        chapter.points = points;
        chapters.push(chapter);
    }
    grammarSet.data = chapters;
    setGrammarId(grammarSet);
    for (let chapter of grammarSet.data) {
        addIdPointMapping(chapter.meta.id, chapter.points, `${title} > ${chapter.title}`);
    }

    let grammars = getGrammarList();
    let id = getId('grammar', title);
    grammars[id] = grammarSet;
    setGrammarList(grammars);
    refreshLists();
}