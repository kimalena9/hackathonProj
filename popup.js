// -HAPPINESS JAR
// pull an inspirational quote [x]
// customizable positive note users--users can add their own positive notes or reminders that get saved to the jar
//  -do we need a try...catch for rejected chrome.get Promise?
// users can add a daily positive moment to the jar (saving memories)
// users can retrieve these happy reminders/notes by clicking a button
// get cute random dog photo?
// way to delete notes?

// fetch a random quote from ZenQuotes API
function fetchRandomQuote() {
  fetch('https://zenquotes.io/api/random/1f1582443228bab0eb6b2bc00b9d629a')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const quoteHTML = data[0].h;
      quoteDisplay.style.display = 'block';
      // console.log(quoteHTML);
      // innerHTML will directly insert our pre-formatted HTML into the DOM
      document.getElementById('quoteDisplay').innerHTML = quoteHTML;
    })
    .catch((error) => {
      document.getElementById(
        'quoteDisplay'
      ).innerText = `Failed to load quote ${error}`;
    });
}

// customizable positive note users--users can add their own positive notes or reminders that get saved to the jar
async function saveNote() {
  const note = document.getElementById('positiveNote').value;

  if (note.trim() === '') {
    alert(`Please enter a valid note before saving :)`);
    return;
  }

  const positiveNotes = await getNotes();

  positiveNotes.push(note);
  // console.log(positiveNotes);

  // save updated moments array back to storage
  // tells Chrome to store the updated positiveNotes array under the key 'positiveNotes'
  await chrome.storage.sync.set({ positiveNotes });
  document.getElementById('positiveNote').value = '';
}

// users can retrieve these happy reminders/notes by clicking a button
async function retrieveNote() {
  const positiveNotes = await getNotes();
  const quoteDisplay = document.getElementById('quoteDisplay');

  // check if this array is empty, if not we will pick a random note and display it on screen
  if (positiveNotes.length > 0) {
    const randomNote =
      positiveNotes[Math.floor(Math.random() * positiveNotes.length)];
    quoteDisplay.innerHTML = `<blockquote>&ldquo;${randomNote}&rdquo;</blockquote>`;
    quoteDisplay.style.display = 'block';
  } else {
    quoteDisplay.innerText = `No notes found!`;
    quoteDisplay.style.display = 'block';
  }
}

async function getNotes() {
  // retrieve existing notes from Chrome storage
  // storage API requires that data be stored and retrieved as an object
  // chrome.storage.sync.get:
  //  -async method for getting data from Chrome sync storage
  //  -parameter/arg: key(s): object with key(s) to retrieve ({positiveNotes: []})
  //  []-> defaults to empty array if no key/value pairs exist

  // await: will pause the code execution until storage retrieval completes (it will make data hold the retrieved values)
  // ...get() will return a promise, will resolve once the data retrieval is complete
  //  will return the object containing requested storage data
  const data = await chrome.storage.sync.get({ positiveNotes: [] });
  return data.positiveNotes;
}

// create function to display notes
async function displayNotes() {
  const positiveNotes = await getNotes();
  const notesContainer = document.getElementById('allNotesContainer');

  // clear previous content
  notesContainer.innerHTML = '';

  // once this function executes we reassign the display to 'block' from 'none'
  notesContainer.style.display = 'block';

  // loop over all saved notes and append each note HTML element to the container
  positiveNotes.forEach((note, index) => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note-ele');

    // Note content
    const noteContent = document.createElement('div');
    noteContent.textContent = note;
    noteDiv.appendChild(noteContent);

    // edit note button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    // 1. the anonymous function will wrap it and store reference to the index value specific to that edit button on each iteration using closure 2. it will also make sure the function doesnt execute immediately
    editBtn.addEventListener('click', () => editNote(index));

    noteDiv.appendChild(editBtn);

    notesContainer.appendChild(noteDiv);
    // delete note button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteNote(index));
    noteDiv.appendChild(deleteBtn);
  });
}
// toggle display function
function toggleAllNotesDisplay() {
  const notesContainer = document.getElementById('allNotesContainer');
  if (notesContainer.style.display === 'none') {
    displayNotes();
  } else {
    notesContainer.style.display = 'none';
  }
}

// create function to edit the notes
async function editNote(index) {
  const positiveNotes = await getNotes();
  let editedNote;
  let promptMsg = `Edit your note: ${positiveNotes[index]}`;

  // loop until the user provides a valid input or cancels the prompt
  do {
    editedNote = prompt(promptMsg);
    // make sure when the user clicks cancel, it will exit the function w/o saving
    if (editedNote === null) {
      return;
    }

    if (editedNote.trim() === '') {
      promptMsg = `Edit the note or press cancel! \n ${positiveNotes[index]}`;
    }
  } while (editedNote.trim() === '');
  // update the element of the array to be reassigned with the editedNote
  positiveNotes[index] = editedNote;
  // save the updated array into the storage
  await chrome.storage.sync.set({ positiveNotes });
  // refresh the notes display with updated array
  displayNotes();
}

// create function to delete note

async function deleteNote(index) {
  const positiveNotes = await getNotes();
  // check if the element we're attempting to delete is a valid element within the array
  if (index >= 0 && index < positiveNotes.length) {
    positiveNotes.splice(index, 1);
    // store the updated array into storage
    await chrome.storage.sync.set({ positiveNotes });
    displayNotes();
  }
}

// create a separate function to get positiveNotes (refactor)[x]
// create function to edit the notes [x]
// create function to delete note [x]
// create function to display notes [x]
// fix empty string saving as note [x]
// would this code be better done utilizing Classes/constructor functions?

// 10/29
// - style the extension w/ css
// - reformat code possibly to make it DRYer?
// - possibly implement random dog photo generator?
// - refactor the fetch call to use async/await
// refactor so we can edit directly inside text area instead?

document
  .getElementById('quoteButton')
  .addEventListener('click', fetchRandomQuote);
document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
document.getElementById('retrieveBtn').addEventListener('click', retrieveNote);
document
  .getElementById('retrieveAllBtn')
  .addEventListener('click', toggleAllNotesDisplay);
