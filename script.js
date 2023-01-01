const inputTitle = document.querySelector('#title');
const inputContent = document.querySelector('#content');
const buttonValidation = document.querySelector('form button');
const deleteIcon = document.querySelector('.delete_img_container');
const toDoContainer = document.querySelector('.to_do');
const doneContainer = document.querySelector('.done');
const verifiedContainer = document.querySelector('.verified');

//variables
let currentDate = new Date();
let count = 1;

// class note
class Note{
    constructor(title, content, date){
        this.title = title;
        this.content = content;
        this.date = date;
        this.noteDOM = document.createElement('div');
        this.noteTitleDOM = document.createElement('h3');
        this.noteContentDOM = document.createElement('p');
        this.noteDateDOM = document.createElement('p');
    }
 
    addNote(container){
         //add class
        this.noteDOM.classList.add('note-bg');
        this.noteDOM.classList.add('note-dragg');
        this.noteDOM.classList.add('do_position');
        this.noteDateDOM.classList.add('note-date');
        this.noteDOM.setAttribute('id', count);
         //add elements
         container.append(this.noteDOM);
        this.noteDOM.append(this.noteTitleDOM);
        this.noteDOM.append(this.noteContentDOM);
        this.noteDOM.append(this.noteDateDOM);

        //add content
        this.noteTitleDOM.textContent = this.title;
        this.noteContentDOM.textContent = this.content;
        this.noteDateDOM.textContent = this.date;
    }

    isDraggable(boolean){
        this.noteDOM.draggable = boolean;
    }
}



// /---------------------/
//au lancement de la page
// /----------------------/
window.onload = getFromLocalStorage();


// /------------------/ 
// creer note au click validation
// /------------------/ 

buttonValidation.addEventListener('click', e=>{
    e.preventDefault(); 
    //creer nouvelle note
    let newNote = new Note(inputTitle.value, inputContent.value, currentDate.toLocaleString());
    newNote.addNote(toDoContainer);
    newNote.isDraggable(true);
    count++;

    //enregistrer dans le localstorage
    addToLocalStorage();
})

// /------------------/ 
// drag drop
// /------------------/ 

function start(e){
    e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("text", e.target.getAttribute("id"));
}

function over(e){
    if(e.currentTarget==deleteIcon){
        e.currentTarget.classList.add('bigger');
    }else{
        e.currentTarget.classList.add('bold-border');
    }
    e.preventDefault();
}

function drop(e){
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    if(e.currentTarget==deleteIcon){
        e.currentTarget.appendChild(document.getElementById(data));
        e.currentTarget.removeChild(document.getElementById(data));
        e.currentTarget.classList.remove('bigger');
        localStorage.clear();
        addToLocalStorage();  
    }else{
        e.currentTarget.classList.remove('bold-border');
        e.currentTarget.appendChild(document.getElementById(data));
        addToLocalStorage();
    }
    e.stopPropagation();
}

function leave(e){
    if(e.currentTarget==deleteIcon){
        e.currentTarget.classList.remove('bigger');
    }else{
        e.currentTarget.classList.remove('bold-border');
    }
    
}


toDoContainer.addEventListener('dragstart', start);
toDoContainer.addEventListener('dragover', over);
toDoContainer.addEventListener('drop',drop);
toDoContainer.addEventListener('dragleave',leave);

doneContainer.addEventListener('dragstart', start);
doneContainer.addEventListener('dragover', over);
doneContainer.addEventListener('drop',drop);
doneContainer.addEventListener('dragleave',leave);

verifiedContainer.addEventListener('dragstart', start);
verifiedContainer.addEventListener('dragover', over);
verifiedContainer.addEventListener('drop',drop);
verifiedContainer.addEventListener('dragleave',leave);

deleteIcon.addEventListener('dragover', over);
deleteIcon.addEventListener('drop',drop);
deleteIcon.addEventListener('dragleave',leave);



// /------------------/ 
// save on local storage
// /------------------/ 

//ajouter elements du dom au localstorage

function addToLocalStorage(){
    var toDoNotesDOM = toDoContainer.querySelectorAll('.to_do div');
    var doneNotesDOM = doneContainer.querySelectorAll('.done div');
    var verifiedNotesDOM = verifiedContainer.querySelectorAll('.verified div');
    var toDoNotes=[];
    var doneNotes=[];
    var verifiedNotes=[];
    
    toDoNotesDOM.forEach(toDoNote => {
        newTabNotes(toDoNotes, toDoNote);
    });

    doneNotesDOM.forEach(doneNote => {
        newTabNotes(doneNotes, doneNote);
    });

    verifiedNotesDOM.forEach(verifiedNote => {
        newTabNotes(verifiedNotes, verifiedNote);
    });

    localStorage.setItem('to-do', JSON.stringify(toDoNotes));
    localStorage.setItem('done', JSON.stringify(doneNotes));
    localStorage.setItem('verified', JSON.stringify(verifiedNotes));
}


function newTabNotes(tab, note){
    let newDoNote = new Note(note.children[0].textContent, note.children[1].textContent, note.children[2].textContent)
    tab.push(newDoNote);  
}


//recuperer elements du localstorage pour mettre a jour au refresh 

function getFromLocalStorage(){
    var toDoStorage =JSON.parse(localStorage.getItem('to-do')) || "";
    var doneStorage =JSON.parse(localStorage.getItem('done')) || "";
    var verifiedStorage =JSON.parse(localStorage.getItem('verified')) || "";

   
    toDoStorage.forEach(note => {
        createNote(note, toDoContainer);
    });

    doneStorage.forEach(note => {
        createNote(note, doneContainer);
    });

    verifiedStorage.forEach(note => {
        createNote(note, verifiedContainer);
    });
    
}

function createNote(note, container){
    let newNote = new Note(note.title, note.content, note.date);
    newNote.addNote(container);
    newNote.isDraggable(true);
    count++;
}
