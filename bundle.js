(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';
var score = 0;
var level = 1;
var startPipe = new Pipe(10, 128, 0, false);
var endPipe = new Pipe(0, (14*64)+128, (9*64), true);
var board = [0];
clearBoard();
var pipes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var state = "waiting for click";
var x = 0;
var y = 0;
var pipeToPlace = new Pipe(getRandomInt(0, 10), 32, 544, false);



canvas.onclick = function(event) {
  event.preventDefault();
  x = Math.floor((event.clientX - 137) / 64);
  y = Math.floor((event.clientY - 58) / 64);
  var loc = ((y * 15) + x);
  switch(state)
  {
    case "waiting for click":
      
  }
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
	pipeToPlace.render(ctx);
  for (var j = 0; j < board.length; j++)
  {
    if(board[j] != 0)
    {
      board[j].render(ctx);
    }
  }
}

function clearBoard() {
  for (var i = 0; i < (15*10); i++)
  {
    board[i] = 0; //sets the values of the board to zero to indicate they are empty
  }
  board[0] = startPipe;
  board[15*10-1] = endPipe;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
},{"./game":2,"./pipe":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";9

module.exports = exports = Pipe;

function Pipe(i, x, y, end)
{
    this.pipeID = i;
    this.x = x+1;
    this.y = y+1;
    this.height = this.width = 62;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/pipes.png');
    this.empty = true;
    this.end = end;
    this.sideOpen = 
    {
        top:false,
        left:false,
        right:false,
        bottom:false
    }
    this.sourceRect =
    {
        x: 0,
        y: 0,
    }
    switch(i)
    {
        case 0:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 0;
            this.sourceRect.y = 0;
            break;
        case 1:
            this.sideOpen.top = false;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 32;
            break;
        case 2:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 63;
            this.sourceRect.y = 32;
            break;
        case 3:     
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 63;
            this.sourceRect.y = 64;
            break;
        case 4:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 31;
            this.sourceRect.y = 64;
            break;
        case 5:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 96;
            break;
        case 6:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 63;
            this.sourceRect.y = 96;
            break;
        case 7:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 63;
            this.sourceRect.y = 128;
            break;
        case 8:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 128;
            break;
        case 9:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 95;
            this.sourceRect.y = 32;
            break;
        case 10:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 95;
            this.sourceRect.y = 64;
            break;
    }
}

Pipe.prototype.update = function()
{

}

Pipe.prototype.render = function(ctx)
{
    ctx.drawImage(this.spritesheet, 
                //image
                this.sourceRect.x, this.sourceRect.y, 32, 32,
                //grabbing what we want to display from image
                this.x, this.y, this.height, this.width);  
                //placing what we want where we want it
}
},{}]},{},[1]);
