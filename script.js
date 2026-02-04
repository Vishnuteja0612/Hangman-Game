const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const playAgainButton = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById(
  "final-message-reveal-word"
);
const figureParts = document.querySelectorAll(".figure-part");

/* ---------- FALLBACK WORDS (Used if API fails) ---------- */
const fallbackWords = [
  "application",
  "programming",
  "interface",
  "wizard",
  "element",
  "prototype",
  "callback",
  "undefined",
  "arguments",
  "settings"
];

let selectedWord = "";
let playable = true;

const correctLetters = [];
const wrongLetters = [];

/* ---------- FETCH WORD FROM FREE API ---------- */
async function fetchRandomWord() {
  try {
    const res = await fetch(
      "https://random-word-api.herokuapp.com/word?length=8"
    );
    const data = await res.json();
    selectedWord = data[0].toLowerCase();
  } catch (error) {
    // fallback if API fails
    selectedWord =
      fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  }
}

/* ---------- DISPLAY WORD ---------- */
function displayWord() {
  wordElement.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
        <span class="letter">
          ${correctLetters.includes(letter) ? letter : ""}
        </span>
      `
      )
      .join("")}
  `;

  const innerWord = wordElement.innerText.replace(/\n/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";
    playable = false;
  }
}

/* ---------- WRONG LETTERS ---------- */
function updateWrongLettersElement() {
  wrongLettersElement.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`).join("")}
  `;

  figureParts.forEach((part, index) => {
    part.style.display = index < wrongLetters.length ? "block" : "none";
  });

  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost. 😕";
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = "flex";
    playable = false;
  }
}

/* ---------- NOTIFICATION ---------- */
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

/* ---------- KEYBOARD INPUT ---------- */
window.addEventListener("keypress", (e) => {
  if (!playable) return;

  const letter = e.key.toLowerCase();

  if (letter >= "a" && letter <= "z") {
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersElement();
      } else {
        showNotification();
      }
    }
  }
});

/* ---------- PLAY AGAIN ---------- */
playAgainButton.addEventListener("click", async () => {
  playable = true;

  correctLetters.splice(0);
  wrongLetters.splice(0);

  await fetchRandomWord();

  displayWord();
  updateWrongLettersElement();
  popup.style.display = "none";
});

/* ---------- INITIALIZE GAME ---------- */
(async function initGame() {
  await fetchRandomWord();
  displayWord();
})();
