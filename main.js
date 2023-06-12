// Canvas setup
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");

let state = "start";
// Game variables
let player = {
  x: cnv.width / 2,
  y: cnv.height - 50,
  width: 25,
  height: 25,
  color: "#8F00FF",
};
let score = 0;
let enemyBlocks = [];
let bullets = [];
let outputEl = document.getElementById("score");

let lastEnemySpawnTime = 0;
let enemySpawnInterval = 750;

// draw
window.addEventListener("load", draw);

function draw() {
  // Game state
  if (state === "start") {
    startScreen();
  } else if (state === "running") {
    gameLogic();
    gameScreen();
  } else if (state === "gameover") {
    gameOver();
  }

  requestAnimationFrame(draw);
}

// event listeners
document.addEventListener("keydown", keydownHandler);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mousemove", mousemoveHandler);

function keydownHandler(e) {
  if (state === "start" && e.code === "Space") {
    state = "running";
  } else if (state === "gameover" && e.code === "Space") {
    reset();
  }
}

function mousedownHandler(e) {
  if (state === "running" && e.button === 0) {
    fireBullet();
  }
}

function mousemoveHandler(e) {
  player.x = e.clientX - cnv.offsetLeft - player.width / 2;
}

function canvasBoundary() {
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > cnv.width) {
    player.x = cnv.width - player.width;
  }
}

// game logic
function gameLogic() {
  if (state === "start") {
    initializeGame();
  } else if (state === "running") {
    updateBullets();
    updateEnemyInterval();
    checkCollisions();
    checkGameOver();
    canvasBoundary();
  }
}

// Drw Game
function gameScreen() {
  let grd = ctx.createLinearGradient(0, 0, 0, cnv.height);
  grd.addColorStop(0, "#2E2B33");
  grd.addColorStop(1, "#87CEEB");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // bullets
  ctx.fillStyle = "#FFFF00";
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillRect(
      bullets[i].x,
      bullets[i].y,
      bullets[i].width,
      bullets[i].height
    );
  }
  // enemy blocks
  ctx.fillStyle = "#FF0000";
  for (let i = 0; i < enemyBlocks.length; i++) {
    ctx.fillRect(
      enemyBlocks[i].x,
      enemyBlocks[i].y,
      enemyBlocks[i].width,
      enemyBlocks[i].height
    );
  }
}

// game screen
function startScreen() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  ctx.font = " bold 36px Courier New";
  ctx.fillStyle = "greenyellow";
  ctx.fillText(
    "Press SPACE to Begin!",
    cnv.height / 2 - 100,
    cnv.width / 2 - 125
  );
}

// transition state
function initializeGame() {
  state = "running";
}

// spawn interval
function updateEnemyInterval() {
  let currentTime = Date.now();
  if (currentTime - lastEnemySpawnTime >= enemySpawnInterval) {
    spawnEnemy();
    lastEnemySpawnTime = currentTime;
  }

  for (let i = 0; i < enemyBlocks.length; i++) {
    enemyBlocks[i].y += enemyBlocks[i].speed;
  }
}

// bullet position
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;
  }
  bullets = bullets.filter((bullet) => bullet.y >= 0);
}

// collision logic
function checkCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemyBlocks.length; j++) {
      if (
        bullets[i].x < enemyBlocks[j].x + enemyBlocks[j].width &&
        bullets[i].x + bullets[i].width > enemyBlocks[j].x &&
        bullets[i].y < enemyBlocks[j].y + enemyBlocks[j].height &&
        bullets[i].y + bullets[i].height > enemyBlocks[j].y
      ) {
        score++;
        outputEl.innerHTML = score;
        // remove bullet / block
        bullets.splice(i, 1);
        enemyBlocks.splice(j, 1);
        break;
      }
    }
  }
}

// check game state
function checkGameOver() {
  for (let i = 0; i < enemyBlocks.length; i++) {
    if (enemyBlocks[i].y + enemyBlocks[i].height >= cnv.height) {
      state = "gameover";
      break;
    }
  }
}

// bullet array
function fireBullet() {
  let bullet = {
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10,
    speed: 5,
  };

  bullets.push(bullet);
}

// rand enemy position
function spawnEnemy() {
  let enemy = {
    x: Math.random() * (cnv.width - 25),
    y: -25,
    width: 25,
    height: 25,
    speed: 1,
  };

  enemyBlocks.push(enemy);
}

// gameover screen
function gameOver() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  ctx.font = " bold 36px Courier New";
  ctx.fillStyle = "greenyellow";
  ctx.fillText(
    "GAME OVER! PRESS SPACE TO RESTART",
    cnv.height / 2 - 250,
    cnv.width / 2 - 100
  );
}

function reset() {
  state = "start";
  player.x = cnv.width / 2;
  outputEl.innerHTML = "";
  score = 0;
  enemyBlocks = [];
  bullets = [];
}
