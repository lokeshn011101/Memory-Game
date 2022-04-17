let grid = [];
let isCardSelected = false;
let lastCard = null;
let matches = 0;
let bestTime = -10000;
let currentTime = 0;
let gameOver = false;
let cardImages = new Map();
let level = 1;
let maxTime = [0, 60, 30, 15];
let imageNames = [
  "ironman",
  "superman",
  "spiderman",
  "drstrange",
  "flash",
  "batman",
  "deadpool",
  "loki"
];
let images = {
  ironman:
    "https://listimg.pinclipart.com/picdir/s/61-615853_pegatina-iron-man-2-colores-in-2018-iron.png",
  superman:
    "https://cdn.freebiesupply.com/logos/large/2x/superman-6-logo-svg-vector.svg",
  spiderman:
    "https://w7.pngwing.com/pngs/524/755/png-transparent-marvel-spider-man-illustration-spider-man-spider-woman-jessica-drew-spider-comics-heroes-superhero.png",
  drstrange:
    "https://w7.pngwing.com/pngs/859/232/png-transparent-marvel-doctor-strange-benedict-cumberbatch-doctor-strange-marvel-cinematic-universe-eye-of-agamotto-marvel-comics-doctor-strange-tshirt-avengers-fictional-character.png",
  flash:
    "https://toppng.com/uploads/preview/how-to-draw-flash-logo-easy-drawings-of-flash-11563059655ht74tzaaqp.png",
  batman:
    "https://e7.pngegg.com/pngimages/546/421/png-clipart-batman-logo-batman-logo-batman-logo-free-logo-design-template-superhero.png",
  deadpool:
    "https://i.pinimg.com/originals/18/bc/a7/18bca7f4e21d2c0d2c9bda1391cdb661.png",
  loki:
    "https://www.pikpng.com/pngl/m/236-2367735_share-this-image-tom-hiddleston-loki-png-clipart.png"
};

const onCardSelect = (e) => {
  if (isCardSelected) {
    if (lastCard.id === e.currentTarget.id) return;
    e.currentTarget.classList.add("is-flipped");

    let currentCard = e.currentTarget,
      previousCard = lastCard;
    if (cardImages.get(currentCard.id) === cardImages.get(previousCard.id)) {
      setTimeout(() => {
        while (previousCard.firstChild)
          previousCard.removeChild(previousCard.firstChild);
        while (currentCard.firstChild)
          currentCard.removeChild(currentCard.firstChild);
        matches++;
        if (matches === 8) {
          gameOver = true;
          bestTime = Math.max(bestTime, currentTime);
          endGame(true);
        }
      }, 600);
    } else {
      setTimeout(() => {
        previousCard.classList.remove("is-flipped");
        currentCard.classList.remove("is-flipped");
      }, 600);
    }
    isCardSelected = false;
  } else {
    isCardSelected = true;
    lastCard = e.currentTarget;
    e.currentTarget.classList.add("is-flipped");
  }
};
const startTimer = (time) => {
  currentTime = time.toFixed(2);
  if (gameOver) {
    bestTime = Math.min(bestTime, currentTime);
    return;
  }
  if (0 === Math.ceil(time)) {
    endGame(false);
    return;
  }
  let timeDiv = document.getElementsByClassName("current-time")[0];
  timeDiv.innerHTML = time.toFixed(2);
  setTimeout(() => {
    startTimer(time - 0.01);
  }, 10);
};
const endGame = (complete) => {
  // console.log(currentTime, bestTime, level, maxTime, maxTime[level - 1]);
  if (complete) {
    level++;
    document.getElementById("restart-button").innerHTML =
      "Next Level<span aria-hidden>_</span><span aria-hidden class='cybr-btn__glitch'>Next Level_</span><span aria-hidden class='cybr-btn__tag'>R25</span>";
  } else {
    level = 1;
    document.getElementById("restart-button").innerHTML =
      "Restart Game<span aria-hidden>_</span><span aria-hidden class='cybr-btn__glitch'>Restart Game_</span><span aria-hidden class='cybr-btn__tag'>R25</span>";
  }
  if (currentTime < 0) currentTime = 0;
  if (bestTime < 0) bestTime = 0;
  document.getElementsByClassName("time-container")[0].style.visibility =
    "hidden";
  document.getElementById("grid").style.display = "none";
  document.getElementById("restart-button").style.display = "block";
  let gameOverDiv = document.getElementById("game-over");
  gameOverDiv.style.display = "block";
  gameOverDiv.innerHTML =
    "<div>Your time: " +
    (maxTime[level - 1] - currentTime) +
    "</div><div>Your best time: " +
    (maxTime[level - 1] - bestTime) +
    "</div>";
  document.getElementById("best-time").innerHTML =
    maxTime[level - 1] - bestTime;
  if (level === 4) {
    let wonDiv = document.createElement("div");
    wonDiv.innerHTML = "You Won!";
    wonDiv.id = "restart-button";
    document.getElementById("restart-button").replaceWith(wonDiv);
  }
};
const startGame = () => {
  // remove start game button
  let startGameButton = document.getElementById("start-button");
  startGameButton.style.display = "none";

  // render grid
  let gridDiv = document.getElementById("grid");
  gridDiv.style.display = "grid";
  let randomCards = imageNames.concat(imageNames);
  randomCards.sort((a, b) => Math.random() - 0.5);
  for (let i = 0; i < 4; ++i) {
    grid.push([]);
    for (let j = 0; j < 4; ++j) {
      let id = i + "_" + j;
      let arrLen = randomCards.length;
      let idx = Math.floor(Math.random() * 100) % arrLen;
      let tileSrcName = randomCards[idx];
      let tile = document.createElement("div"),
        tileFront = document.createElement("div"),
        tileBack = document.createElement("div"),
        tileImg = document.createElement("img");

      tile.classList.add("card");
      tileFront.style.backgroundColor = "black";
      tileFront.classList.add("card__face", "card__face--front");
      tileBack.classList.add("card__face", "card__face--back");
      tileImg.src = images[tileSrcName];
      tileBack.appendChild(tileImg);
      tileImg.classList.add("tile");

      tile.onclick = onCardSelect;
      tile.id = id;
      tileBack.appendChild(tileImg);
      tile.appendChild(tileFront);
      tile.appendChild(tileBack);
      gridDiv.appendChild(tile);

      cardImages.set(id, tileSrcName);
      grid[i].push(tile);
      randomCards.splice(idx, 1);
    }
  }
  // start timer
  document.getElementsByClassName("time-container")[0].style.visibility =
    "visible";
  startTimer(maxTime[level]);
};
const restartGame = () => {
  grid = [];
  isCardSelected = false;
  lastCard = null;
  matches = 0;
  currentTime = 0;
  gameOver = false;
  cardImages = new Map();

  let gridDiv = document.getElementById("grid");
  while (gridDiv.firstChild) gridDiv.removeChild(gridDiv.firstChild);
  gridDiv.style.display = "grid";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("game-over").style.display = "none";
  startGame();
};
