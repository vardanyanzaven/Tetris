const playBtn = document.querySelector(".play-btn");

document
  .querySelector(".instructions-btn")
  .addEventListener("click", function (e) {
    if (e.target?.nextElementSibling?.classList.contains("game-controls")) {
      document
        .querySelector(".instructions-div")
        .removeChild(document.querySelector(".game-controls"));
    } else {
      document.querySelector(".instructions-div").insertAdjacentHTML(
        "beforeend",
        `
            <div class="game-controls">
            <p class="game-ctrl-info"><span class="game-ctrl-btn"><i class="fa-solid fa-arrow-up"></i></span> Flip the Block</p>
            <p class="game-ctrl-info"><span class="game-ctrl-btn"><i class="fa-solid fa-arrow-right"></i></span> Move Right</p>
            <p class="game-ctrl-info"><span class="game-ctrl-btn"><i class="fa-solid fa-arrow-left"></i></span> Move Left</p>
            <p class="game-ctrl-info"><span class="game-ctrl-btn"><i class="fa-solid fa-arrow-down"></i></span> Move Down</p>
            </div>
            `
      );
    }
  });

let score = 0;
let lines = 4;
let level = 1;

const canvas = document.querySelector(".game-board");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "white";

// Set the size of the game board and blocks
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 20;

// Draw the game board
ctx.strokeRect(0, 0, canvas.width, canvas.height);
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLUMNS; j++) {
    ctx.strokeRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }
}

// Define the tetromino shapes
const shapes = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
];

// Set the initial position and shape of the falling tetromino
let x = 4;
let y = 0;
let shape = shapes[2];

// Initialize the game board
let board = [];
for (let i = 0; i < ROWS; i++) {
  board[i] = [];
  for (let j = 0; j < COLUMNS; j++) {
    board[i][j] = 0;
  }
}

function drawTetromino() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      ctx.strokeRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      if (board[i][j] === 1) {
        ctx.fillRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
          x * BLOCK_SIZE + j * BLOCK_SIZE,
          y * BLOCK_SIZE + i * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

// Function to move the falling tetromino down
function moveDown() {
  y++;
  if (!checkCollision()) {
    drawTetromino();
  } else {
    y--;
    mergeTetromino();
    y = 0;
    x = 4;
    shape = shapes[Math.floor(Math.random() * shapes.length)];
    if (checkCollision()) {
      const gameOverP = document.createElement("p");
      gameOverP.innerText = "Game Over";
      gameOverP.style.fontSize = "40px";
      document.querySelector(".score-num").innerText = 0;
      document.querySelector(".tetris-logo-img").replaceWith(gameOverP);
      setTimeout(() => location.reload(), 2000);
    }
  }
}

// Function to check for collision
function checkCollision() {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (
        shape[i][j] === 1 &&
        (board[i + y] === undefined ||
          board[i + y][j + x] === undefined ||
          board[i + y][j + x] === 1)
      ) {
        return true;
      }
    }
  }
  return false;
}

// Function to merge the falling tetromino with the game board
function mergeTetromino() {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        board[y + i][x + j] = shape[i][j];
      }
    }
  }

  removeCompletedLines();
  score += Math.floor(Math.random() * (300 - 150 + 1)) + 150;
  document.querySelector(".score-num").innerText = score;

  y = 0;
  x = 4;
  shape = shapes[Math.floor(Math.random() * shapes.length)];
}

function moveLeft() {
  --x;
  if (checkCollision()) {
    ++x;
  }
}

function moveLeft() {
  --x;
  if (checkCollision()) {
    ++x;
  }
}

// Function to move the tetromino to the right
function moveRight() {
  x++;
  if (checkCollision()) {
    x--;
  }
}

// Function to move the tetromino down
function MoveArrowDown() {
  y++;
  if (checkCollision()) {
    y--;
  }
}

// Function to rotate the tetromino
let rotation = 0;

function rotate() {
  rotation = (rotation + 1) % 4;
  let newShape = [];
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      switch (rotation) {
        case 0:
          newShape[i] = newShape[i] || [];
          newShape[i][j] = shape[i][j];
          break;
        case 1:
          let newI = shape[i].length - 1 - j;
          newShape[newI] = newShape[newI] || [];
          newShape[newI][i] = shape[i][j];
          break;
        case 2:
          newShape[shape.length - 1 - i] = newShape[shape.length - 1 - i] || [];
          newShape[shape.length - 1 - i][shape.length - 1 - j] = shape[i][j];
          break;
        case 3:
          let newJ = shape.length - 1 - i;
          newShape[j] = newShape[j] || [];
          newShape[j][newJ] = shape[i][j];
          break;
      }
    }
  }
  shape = newShape;
  if (checkCollision()) {
    rotation = (rotation + 2) % 4;
  }
}

function removeCompletedLines() {
  for (let i = board.length - 1; i >= 0; i--) {
    let isLineComplete = true;
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        isLineComplete = false;
        break;
      }
    }
    if (isLineComplete) {
      board.splice(i, 1);
      board.unshift(new Array(10).fill(0));
      lines++;
      document.querySelector(".lines-num").innerText = lines;
      if (lines % 5 === 0) level++;
      document.querySelector(".level-num").innerText = level;
    }
  }
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      MoveArrowDown();
      break;
    case "ArrowUp":
      rotate();
      break;
  }
});

playBtn.addEventListener("click", (e) => {
  const instructionsDiv = document.querySelector(".instructions-div");
  if (!e.target.classList.contains("playing")) {
    setInterval(moveDown, 1000);
    drawTetromino();
    document.querySelector(".level-num").innerText = 1;
    e.target.classList.add("playing");
    e.target.innerText = "Reset";
    if (instructionsDiv.querySelector(".game-controls") !== null)
      instructionsDiv.removeChild(document.querySelector(".game-controls"));
  } else {
    location.reload();
  }
});
