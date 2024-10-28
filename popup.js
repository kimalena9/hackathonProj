// fetch a random quote from ZenQuotes API
// https://zenquotes.io/api/random
// -HAPPINESS JAR
// pull an inspirational quote [x]
// customizable positive note users--users can add their own positive notes or reminders that get saved to the jar
// users can add a daily positive moment to the jar (saving memories)
// users can retrieve these happy reminders/notes by clicking a button

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

document
  .getElementById('quoteButton')
  .addEventListener('click', fetchRandomQuote);
