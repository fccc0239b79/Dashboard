'use strict';
//---------------------------ADD-ELEMENT----------------------------------------

//////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', initialize);

function initialize() {
    loadNotes();

    //set up event handlers
    // add new note button
    document.querySelector('#addButton').addEventListener('click', addNewNote);
    document.querySelector('#backButton').addEventListener('click', getPrevious);
    document.querySelector('#nextButton').addEventListener('click', getNext);
    document.querySelector('#saveButton').addEventListener('click', saveNoteToDB);
    document.querySelector('#deleteButton').addEventListener('click', deleteNote);
}

function loadNotes() {
    var url = '/api/notes';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            putNoteInPage(JSON.parse(xhr.responseText)); // notes parameter
        } else {
            document.querySelector('body > main').innerHTML = 'sorry, something went wrong...';
        }
    }
    xhr.send();
}

function addNewNote() {
    reset();
}

var Notes;

function putNoteInPage(notes) {
    Notes = notes;
}

var index = 0;
//textContent
function getPrevious(notes) {

    if (index == 0) {
        index = Notes.length;
    }
    if(Notes.length == 0) {
      window.confirm('There is no more notes !');
      //reset();
    } else {
      index--;
      update();
    }



}

function getNext(notes) {

index++;
    if (index == Notes.length || index >=   Notes.length) {
        index = 0;
    }

    if(Notes.length == 0) {
      window.confirm('There is no more notes !');
      //reset();
    } else {
      update();
    }



}

function update() {

  window.tit.value = Notes[index].title;
  window.con.value = Notes[index].content;
  window.deleteButton.dataset.id = Notes[index].id;
}

function reset() {
    document.getElementById("tit").value = "";
    document.getElementById("con").value = "";

    //window.deleteButton.dataset.id = 0;
}

function saveNoteToDB() {

    var newNote = {
        title: window.tit.value,
        content: window.con.value
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/api/notes/save', true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(newNote));

    loadNotes();
    reset();

}

function deleteNote(e) {

var noteDataID = e.target.dataset.id;

  if(e.target.id && window.confirm('Do you want delete this note?')) {

    var xhr = new XMLHttpRequest();

    xhr.open('DELETE', '/api/notes/' + noteDataID, true);
    xhr.send();
    loadNotes();
    reset();

  }

}
