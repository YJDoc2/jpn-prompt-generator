import { getGrammarList, getVocabList } from "./dataHandler.mjs";
import { initDarkModeState } from "./stateManager.mjs";

const ignoreVocabKeys = ['n5Words', 'n4Words'];
const ignoreGrammarKeys = ['genkiGrammar'];

const ignoreKeys = [...ignoreVocabKeys, ...ignoreGrammarKeys];

window.onload = () => {
    initDarkModeState();
    initUI();
}


function cleanVocabSetForDownload(set){
    // as the input data scheme for vocab set is array of data,
    // we simply return the data
    return set.data;

}

function cleanGrammarSetForDownload(set){
    for(let chapter of set.data){
        chapter.meta = undefined;
        for(let point of chapter.points){
            if(point.links && point.links.length == 0){
                point.links = undefined;
            }
        }
    }
    return set.data;
}

function download(set,key){
    let a = document.createElement('a');
    let data = JSON.stringify(set,null,2);
    let file = new Blob([data],{type:'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = `${key}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
}

function createLi(set, allowDelete, downloadCallback, deleteCallback) {
    let li = document.createElement('li');
    li.classList = 'list-group-item w-50';
    let div = document.createElement('div');
    div.classList = 'row'
    let span = document.createElement('span');
    span.style = 'align-self:center;'
    span.classList = 'col col-8';
    span.textContent = set.title;
    div.appendChild(span);

    let downloadBtn = document.createElement('button');
    downloadBtn.classList = 'btn col col-2 bi bi-file-earmark-arrow-down'
    downloadBtn.style = 'font-size: 1.2rem; color: cornflowerblue;';
    downloadBtn.onclick = downloadCallback;
    div.appendChild(downloadBtn);


    if (allowDelete) {
        let deleteBtn = document.createElement('button');
        deleteBtn.classList = 'btn col col-2 bi bi-trash3-fill'
        deleteBtn.style = 'font-size: 1.2rem; color: red;';
        div.appendChild(deleteBtn);
    }

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
        let allowDelete = !ignoreKeys.includes(v);
        vocabUl.appendChild(createLi(set,allowDelete,()=>{
            let clean = cleanVocabSetForDownload(set);
            download(clean,v);
        }));
    }

    for (let g of Object.keys(grammarList)) {
        let set = grammarList[g];
        let allowDelete = !ignoreKeys.includes(g);
        grammarUl.appendChild(createLi(set,allowDelete,()=>{
            let clean = cleanGrammarSetForDownload(set);
            download(clean,g);
        }));
    }
}