"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';
var score = 0;
var level = 1;
var board = [0];
clearBoard();
var pipes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var state = "waiting for click";
var x = 0;
var y = 0;
canvas.onclick = function(event) {
  event.preventDefault();
  x = Math.floor((event.clientX - 137) / 64);
  y = Math.floor((event.clientY - 58) / 64);

  var loc = ((y * 15) + x);

  // TODO: Place or rotate pipe tile
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  for (var i = 0; i < canvas.width; i+=64)
  {
    ctx.fillRect(i+128, 0, 1, canvas.height);
    ctx.fillRect(128, i, canvas.width, 1);
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 128, canvas.height);
  // TODO: Render the board
ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("SCORE: " +x, 7, 32);
    ctx.fillText("LEVEL: " +y, 7, 56);
	 
}

function clearBoard() {
  for (var i = 0; i < (15*10); i++)
  {
    board[i] = 0; //sets the values of the board to zero to indicate they are empty
  }
}