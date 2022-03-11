const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log('mode =', urlParams.get('mode'));

// const [targetPhrases, phraseKeywords] = [
//   ['The Plot Thickens', 'Thickens'],
//   ['Back to Square One', 'Square'],
//   ['Not the Sharpest Tool in the Shed', 'Sharpest Tool Shed'],
//   ['I Smell a Rat', 'Rat Smell'],
//   ['Wake Up Call', 'Wake'],
//   ['A Day Late and a Dollar Short', 'Dollar Late Short'],
//   ['Ride Him Cowboy', 'Cowboy'],
//   ['A Bite at the Cherry', 'Cherry Bite'],
//   ['Mountain Out of a Molehill', 'Molehill Mountain'],
//   ['Theres No I in Team', 'Team'],
//   ['Elephant in the Room', 'Elephant Room'],
//   ['No Brainer', 'Brainer'],
//   ['Two Down One to Go', 'Down One'],
//   ['Knock Your Socks Off', 'Socks Knock'],
//   ['Right off the bat', 'bat off'],
// ];
const [targetPhrases, phraseKeywords] = PHRASES.map((phrase) => [phrase])
.map(([phrase,keywords]) => {
  if(!keywords) keywords = phrase.split(/\s+/).filter(w => w.length >= 4).sort((a,b) => b.length-a.length).slice(0,2).join(' ');
  console.log(`${phrase} => ${keywords}`);
  return [phrase.toLowerCase(), keywords.toLowerCase().split(/\s+/)]
}).reduce(([phrasesArray,keywordsArray], [phrase,keywords]) => {
  phrasesArray.push(phrase); keywordsArray.push(keywords);
  return [phrasesArray, keywordsArray]
}, [[], []]);

// const dictionary = [].concat(ones, twos, threes, fours, fives, sixes, sevens, eights, nines, tens, elevens);

let WORD_LENGTH = 3
let MAX_GUESSES = 6
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
const offsetFromDate = new Date(2022, 3, 7)
const msOffset = offsetFromDate - Date.now()
const dayOffset = msOffset / 1000 / 60 / 60 / 24

let gameMode = urlParams.get('mode') || "daily" // "random" // "daily"
let newPhrase = false

let phraseIndex = gameMode==="daily" ? Math.floor(dayOffset) : randomInt(0, targetPhrases.length-1)
// let phraseIndex = 3

// const stats = { attempts: 0 }
// const doneWords = []

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

let gameStats = { result: null, phrase: null, fill: null }
let wordStats = { attempts: [], word: "", index: -1 }
let phraseStats = { attempts: [], doneWords: [], doneWordsIndexes: [], attemptWords: [], attemptWordsIndexes: [], attemptWordsGuesses: [] }
let loadingMode = false

// const targetWord = targetWords[Math.floor(dayOffset)]
// const targetPhrase = targetPhrases[Math.floor(dayOffset)]

// const targetPhrase = "Right off the bat";
// const targetWord = "dance";


// localStorage.setItem("targetWord", "the")
// localStorage.setItem("targetPhrase", "Right off the bat")
// localStorage.setItem("targetPhraseFill", "..... off ... bat")

// const targetWord = localStorage.getItem("targetWord");
// const targetPhrase = localStorage.getItem("targetPhrase");
// const targetPhraseFill = localStorage.getItem("targetPhraseFill");
// const phraseArray = targetPhrase.split(/\s+/);
// const phraseFillArray = targetPhraseFill.split(/\s+/);

let targetWord
let targetPhrase
let targetPhraseFill
let phraseArray
let phraseFillArray

function loadPhrase() {
  if(phraseIndex >= targetPhrases.length) phraseIndex = 0;
  console.log({phraseIndex, targetPhrases, targetPhrase:targetPhrases[phraseIndex]})
  targetPhrase = targetPhrases[phraseIndex].toLowerCase();
  phraseArray = targetPhrase.split(/\s+/);
  console.log('...', {phraseStats})
  console.log({targetPhrase, phraseArray})
  phraseFillArray = phraseArray.map((word,index) => {
    return phraseStats.doneWordsIndexes.includes(index) ? word : 
      phraseStats.attemptWordsIndexes.includes(index) ? phraseStats.attemptWordsGuesses[index] : 
      ".".repeat(word.length)
    // return phraseStats.doneWords.includes(word) ? word : ".".repeat(word.length)
  });
  targetPhraseFill = phraseFillArray.join(" ");
  // if(gameStats.fill) targetPhraseFill = gameStats.fill;
  // if(gameStats.fill) phraseFillArray = targetPhraseFill.split(/\s+/);
  // const targetPhraseFill = phrase.replace(/./g, ".")
  // const phraseFillArray = targetPhraseFill.split(/\s+/);
  // localStorage.setItem("targetPhrase", targetPhrase)
  // localStorage.setItem("targetPhraseFill", targetPhraseFill)
  if(wordStats.word) { 
    targetWord = wordStats.word;
  }
  else {
    const prevIndex = wordStats.index;
    const wordsYetTodoCount = phraseArray.length - phraseStats.doneWordsIndexes.length;
    const wordsYetToTryCount = phraseArray.length - phraseStats.attemptWordsIndexes.length;
    // select random target word that is not already done
    for(let i = 0; i < 1000; i++) {
      const wordIndex = Math.floor(Math.random() * phraseArray.length);
      if(prevIndex === wordIndex) if(wordsYetTodoCount>1) continue; // don't repeat same word so soon
      // if(prevIndex === wordIndex) if(wordsYetToTryCount>1) continue; // don't repeat same word so soon
      targetWord = phraseArray[wordIndex];
      wordStats.index = wordIndex;
      const keywordIndex = phraseKeywords[phraseIndex]?.indexOf(targetWord);
      console.log({targetWord, wordIndex, keywordIndex, phraseIndex, keywords:phraseKeywords[phraseIndex]})
      if(keywordIndex>=0) if(wordsYetToTryCount>keywordIndex+1) continue; // skip words that are keywords until last
      // if(keywordIndex>=0) if(wordsYetTodoCount>keywordIndex+1) continue; // skip words that are keywords until last
      // if(keywordIndex===0) if(wordsYetTodoCount>1) continue; // skip words that are keywords until last
      // if(keywordIndex===1) if(wordsYetTodoCount>2) continue; // skip words that are keywords until last
      // if(keywordIndex===2) if(wordsYetTodoCount>3) continue; // skip words that are keywords until last
      console.log(i, phraseStats.doneWordsIndexes, wordIndex, phraseStats.doneWordsIndexes.includes(wordIndex))
      if (!phraseStats.doneWordsIndexes.includes(wordIndex)) break;
      // if (!phraseStats.doneWords.includes(targetWord)) break;
    }
  }
  console.log({ targetWord, targetPhrase, targetPhraseFill, phraseArray, phraseFillArray })
}

function createFillPhrase(phraseArray, phraseFillArray) {
  console.log('...', {phraseArray, phraseFillArray})
  return phraseArray.map((word, index) => {
    const fillWord = phraseFillArray[index];
    return createFillWord(word, fillWord);
    let color = "yellow";
    if (word === fillWord) color = "green";
    if(fillWord.match(/^\.+$/)) color = "gray";
    return `<span style="color:${color}">${phraseFillArray[index]}</span>`
  }).join(`<span style="letter-spacing: 20px;"> </span>`);
}
function createFillWord(word, fillWord) {
  const wordLetters = word.split("");
  const fillLetters = fillWord.split("");
  return wordLetters.map((letter, index) => {
    const fillLetter = fillLetters[index];
    const FILLLETTER = fillLetter.toUpperCase();
    let color = "gray";
    if(fillLetter===letter) color = "green";
    else if(wordLetters.includes(fillLetter)) color = "yellow";
    return `<span style="color: ${color}; xbackground:${color}; letter-spacing: 10px; font-weight: bold">${FILLLETTER}</span>`;
    return `<span style="background:${color}">${fillLetter}</span>`;
    return `<span style="color:${color}">${fillLetter}</span>`;
  }).join("");
}

function createGrid(ncols=WORD_LENGTH, nrows=MAX_GUESSES) {
  if(targetWord) ncols = targetWord.length;
  if(targetWord) WORD_LENGTH = targetWord.length;
  const guessGrid = document.querySelector("[data-guess-grid]")
  // add columns and rows css
  // grid-template-columns: repeat(3, 4em);
  // grid-template-rows: repeat(6, 4em);
  // guessGrid.style += "grid-template-columns: repeat(" + ncols + ", 4em)";
  // guessGrid.style += "grid-template-rows: repeat(" + nrows + ", 4em)";
  guessGrid.style.gridTemplateColumns = "repeat(" + ncols + ", 2.5em)";
  guessGrid.style.gridTemplateRows = "repeat(" + nrows + ", 2.5em)";
  
  let guessGridHTML = "";
  for (let i = 0; i < ncols*nrows; i++) {
    guessGridHTML += `<div class="tile"></div>\n`;
  }
  guessGrid.innerHTML = guessGridHTML;
}
function fillPhrase(phraseArray, phraseFillArray) {
  document.getElementById("data-phrase").style.fontSize = "30px";
  document.getElementById("data-phrase").innerHTML = createFillPhrase(phraseArray, phraseFillArray);
}

loadGame();

startInteraction()

function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
  console.log({activeTiles})
  activeTiles.forEach((tile, index, array) => console.log(index, tile.dataset.state))
}

function flipTile(tile, index, array, guess) {
  console.log(tile, index, array, guess, tile.dataset.state)
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, 500 + (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct"
        key.classList.add("correct")
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location"
        key.classList.add("wrong-location")
      } else {
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }
      console.log(`logging ... transitionend ... ${index} ${tile.dataset.state}`)
      if(loadingMode) return;

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}

function checkWinLose(guess, tiles) {
  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  logWordStats(guess, targetWord)
  // logPhraseStats(guess, targetWord)
  if (guess === targetWord) {
    logPhraseStats(guess, targetWord, {done:1});
  } else if (remainingTiles.length === 0) {
    logPhraseStats(guess, targetWord);
  }
  saveStats();
  if (guess === targetWord) {
    danceTiles(tiles)
    stopInteraction()
    if(phraseStats.doneWords.length === phraseArray.length) {
      gameStats.result = "win";
      saveStats();
      fillPhrase(phraseArray, phraseArray);
      showAlert("You Win!", 5000)
    } else if(confirm("Continue?")) {
      location.reload()
    } else {
      showAlert("You Got It!", 5000)
    }
    return
  }

  if (remainingTiles.length === 0) {
    // showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
    if(confirm("Continue?")) {
      showAlert("You Haven't Got It!", 5000)
      location.reload()
    }
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / WORD_LENGTH)
  })
}

function logWordStats(guess, word) {
  const count = wordStats.attempts.length + 1;
  wordStats.attempts.push({guess, word, count});
  wordStats.word = word;
}
// function logPhraseStats(guess, word) {
//   const count = wordStats.attempts.length;
//   phraseStats.attempts.push({guess, word, count, attempts: wordStats.attempts});
// }
function logPhraseStats(guess, targetWord, {done=0,clear=1}={}) {
  gameStats.phrase = targetPhrase;
  if(done) phraseFillArray[wordStats.index] = targetWord;
  else phraseFillArray[wordStats.index] = guess;
  if(done) targetPhraseFill = phraseFillArray.join(" ");
  gameStats.phraseFill = targetPhraseFill;
  if(done) phraseStats.doneWords.push(targetWord)
  phraseStats.attemptWords.push(targetWord)
  if(done) phraseStats.doneWordsIndexes.push(wordStats.index)
  phraseStats.attemptWordsIndexes.push(wordStats.index)
  if(done || clear) phraseStats.attemptWordsGuesses[wordStats.index] = guess;
  phraseStats.attempts.push(wordStats.attempts)
  if(clear) wordStats.attempts = []
  if(clear) wordStats.word = ""
}
function saveStats() {
  localStorage.setItem("gameStats", JSON.stringify(gameStats));
  localStorage.setItem("wordStats", JSON.stringify(wordStats));
  localStorage.setItem("phraseStats", JSON.stringify(phraseStats));
  localStorage.setItem("phraseIndex", phraseIndex);
  console.log({
    gameStats: gameStats,
    wordStats: wordStats,
    phraseStats: phraseStats
  })
}

function loadStats() {
  if(newPhrase) return; // don't load stats if new phrase
  // If phrase index has changed, its a new day, skip loading and start from scratch
  const phraseIndexString = localStorage.getItem("phraseIndex");
  console.log({phraseIndex, phraseIndexString})
  if(phraseIndexString==null) return;
  const gameStatsString = localStorage.getItem("gameStats");
  if(gameStatsString==null) return;
  if(gameStatsString) gameStats = JSON.parse(gameStatsString);
  if(gameMode==="daily") {
    if(parseInt(phraseIndexString) !== phraseIndex) return; // new day, new phrase
  } else { // gameMode==="random"
    if(gameStats.result) { // If game has been finished, skip loading stats and move to next phrase
      gameStats = { result: null, phrase: null, fill: null };
      // phraseIndex++;
      return;
    } else {
      phraseIndex = parseInt(phraseIndexString);
    }
  }
  // if(parseInt(phraseIndexString) !== phraseIndex) {
  //   // if(parseInt(phraseIndexString) > phraseIndex) phraseIndex = parseInt(phraseIndexString);
  //   // else return; // else ignore sored value
  //   if(gameMode==="daily") return; // new day, new phrase
  //   else phraseIndex = parseInt(phraseIndexString);
  // }
  const wordStatsString = localStorage.getItem("wordStats");
  const phraseStatsString = localStorage.getItem("phraseStats");
  if(wordStatsString) wordStats = JSON.parse(wordStatsString);
  if(phraseStatsString) phraseStats = JSON.parse(phraseStatsString);
  if(!wordStats.attempts) wordStats.attempts = [];
  if(!phraseStats.attempts) phraseStats.attempts = [];
  if(!phraseStats.doneWords) phraseStats.doneWords = [];
  if(!phraseStats.attemptWords) phraseStats.attemptWords = [];
  if(!phraseStats.doneWordsIndexes) phraseStats.doneWordsIndexes = [];
  if(!phraseStats.attemptWordsIndexes) phraseStats.attemptWordsIndexes = [];
  if(!phraseStats.attemptWordsGuesses) phraseStats.attemptWordsGuesses = [];
}

async function loadGame() {
  loadStats();
  console.log({gameStats, wordStats, phraseStats})

  loadPhrase()
  fillPhrase(phraseArray, phraseFillArray);

  createGrid();
  // return

  if(wordStats && wordStats?.attempts?.length) {
    loadingMode = true;
    for(let {guess, word, count} of wordStats.attempts) {
      loadWord(guess)
      await sleep(FLIP_ANIMATION_DURATION * guess.length)
    }
    loadingMode = false;
    startInteraction()
  }
  console.log({
    gameStats: gameStats,
    wordStats: wordStats,
    phraseStats: phraseStats
  })

  function loadWord(guess) {
    guess.split('').forEach((letter, index) => {
      pressKey(letter)
    })
    submitGuess()
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
