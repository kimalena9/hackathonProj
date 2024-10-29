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
  // retrieve existing notes from Chrome storage
  // storage API requires that data be stored and retrieved as an object
  // chrome.storage.sync.get:
  //  -async method for getting data from Chrome sync storage
  //  -parameter/arg: key(s): object with key(s) to retrieve ({positiveNotes: []})
  //  []-> defaults to empty array if no key/value pairs exist

  // await: will pause the code execution until storage retrieval completes (it will make data hold the retrieved values)
  // ...get() will return a promise, will resolve once the data retrieval is complete
  //  will return the object containing requested storage data
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

  // check if this array is empty, if not we will pick a random note and display it on screen
  if (positiveNotes.length > 0) {
    const randomNote =
      positiveNotes[Math.floor(Math.random() * positiveNotes.length)];
    document.getElementById('displayNote').innerText = randomNote;
  } else {
    document.getElementById('displayNote').innerText = `No notes found!`;
  }
}

async function getNotes() {
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
    // onclick -> execute edit function
    editBtn.onclick = editNote(index);
    noteDiv.appendChild(editBtn);

    notesContainer.appendChild(noteDiv);
    // delete note button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    // onclick -> execute delete function
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
  const editedNote = prompt(`Edit your note: ${positiveNotes[index]}`);
  if (!editedNote) {
    positiveNotes[index] = editedNote;
    await chrome.storage.sync.set({ positiveNotes });
    displayNotes();
  }
}

// create a separate function to get positiveNotes (refactor)[x]
// create function to delete note
// create function to display notes

document
  .getElementById('quoteButton')
  .addEventListener('click', fetchRandomQuote);
document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
document.getElementById('retrieveBtn').addEventListener('click', retrieveNote);
document
  .getElementById('retrieveAllBtn')
  .addEventListener('click', toggleAllNotesDisplay);
