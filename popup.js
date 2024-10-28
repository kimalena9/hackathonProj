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
  const data = await chrome.storage.sync.get({ positiveNotes: [] });
  console.log(data);

  const positiveNotes = data.positiveNotes;
  positiveNotes.push(note);
  // console.log(positiveNotes);

  // save updated moments array back to storage
  // tells Chrome to store the updated positiveNotes array under the key 'positiveNotes'
  await chrome.storage.sync.set({ positiveNotes });
  document.getElementById('positiveNote').value = '';
}

// users can retrieve these happy reminders/notes by clicking a button
async function retrieveNote() {
  const data = await chrome.storage.sync.get({ positiveNotes: [] });
  const positiveNotes = data.positiveNotes;

  // check if this array is empty, if not we will pick a random note and display it on screen
  if (positiveNotes.length > 0) {
    const randomNote =
      positiveNotes[Math.floor(Math.random() * positiveNotes.length)];
    document.getElementById('displayNote').innerText = randomNote;
  } else {
    document.getElementById('displayNote').innerText = `No notes found!`;
  }
}

document
  .getElementById('quoteButton')
  .addEventListener('click', fetchRandomQuote);
document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
document.getElementById('retrieveBtn').addEventListener('click', retrieveNote);
