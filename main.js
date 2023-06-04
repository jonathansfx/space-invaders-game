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


// Draw Game
function gameScreen() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game Screen
function startScreen() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
  
    ctx.font = "48px Calibri";
    ctx.fillStyle = "white";
    ctx.fillText("Press SPACE to Begin!", cnv.height / 2 - 75, cnv.width / 2 - 100);
  }
