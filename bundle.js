(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var score = 0;
var level = 1;
var startPipe = new Pipe(10, 128, 0, false);
//startPipe.empty = false;
var endPipe = new Pipe(0, (14*64)+128, (9*64), true);
var board = [0];
var waterBoard = [0];
clearBoard();
clearWaterBoard();
var x = 0;
var y = 0;
var pipeToPlace = new Pipe(getRandomInt(0, 10), 32, 544, false);
var headStart = 5000;
var timer = 0;
var flowing = false;
var flowCount = 0;
var gameOver = false;
var flowRate = 1500;
var placeSound = new Audio('assets/placeN.wav');
var rotSound = new Audio('assets/rotateN.wav');
var levelUp = new Audio('assets/levelN.wav');
var goN = new Audio('assets/goN.wav');
var bgMusic = new Audio('assets/bgm.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.1;
  bgMusic.play();
var leveled = false;


canvas.onclick = function(event) 
{
    event.preventDefault();
    x = Math.floor((event.clientX - 137) / 64);
    y = Math.floor((event.clientY - 84) / 64);
    var loc = ((y * 15) + x);
    if(x >= 0 && board[loc] == 0)
    {
      pipeToPlace.x = (x*64)+129;
      pipeToPlace.y = (y*64)+1;
      board[loc] = pipeToPlace;
      placeSound.play();
      pipeToPlace = new Pipe(getRandomInt(0, 10), 32, 544, false);
    }    
}

/**
 * Right click function that allows for pipe rotation
 */
canvas.oncontextmenu = function(event)
{
    event.preventDefault();
    x = Math.floor((event.clientX - 137) / 64);
    y = Math.floor((event.clientY - 84) / 64);
    var loc = ((y * 15) + x);
    if(x >= 0 && board[loc] != 0 && board[loc].empty == true)
    {
      board[loc].rotate();
      rotSound.play();
    } 
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
function update(elapsedTime) 
{
  leveled = false;
  headStart -= elapsedTime;
  if (headStart <= 0)
  {
    flowing = true;
    board[0].empty = false;
    waterBoard[0] = 1;
  }
  if (flowing)
  {
    timer += elapsedTime;
    if (timer >= flowRate)
    {
      timer = 0;
      for(var i = 0; i<board.length; i++)
      {
        if(board[i].empty == false)
        {
          
          checkLeft(i);
          checkAbove(i);
          checkRight(i);
          if(levelUp == true)
          {
            return;
          }
          checkBelow(i);
          if(levelUp == true)
          {
            return;
          }
        }
      }
      if(flowCount == 0)
      {
        gameOver = true;
      }
      for(var j = 0; j<board.length; j++)
      {
        if(board[j] != 0)
        {
          board[j].justFilled = false;
        }   
      }
      if(flowCount == 0)
      {
        gameOver = true;
      }
      flowCount = 0;
    }    
  }
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
  ctx.fillStyle = "#00FFFF";
  if(gameOver)
  {
    ctx.font = "100px Arial";
    ctx.fillText("Game Over", 100, 100);
    goN.play();
    ctx.font = "20px Arial";
    ctx.fillText("score: "+score, 30, canvas.height - 30);

  }
  else{
    for(var k = 0; k < waterBoard.length; k++)
  {
    if(waterBoard[k] == 1)
    {
      ctx.fillRect((k%15)*64+129, Math.floor(k/15)*64, 62, 62);
    }
  }
  ctx.fillStyle = "black";
  for (var i = 0; i < canvas.width; i+=64)
  {
    ctx.fillRect(i+128, 0, 1, canvas.height);
    ctx.fillRect(128, i, canvas.width, 1);
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 128, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("SCORE: " +score, 7, 32);
  ctx.fillText("LEVEL: " +level, 7, 56);
  if (flowing == false)
  {
    var hs = (headStart/1000).toFixed(0);
    ctx.fillText("WATER", 7, 88);
    ctx.fillText("COMING", 7, 106);
    ctx.fillText("IN: "  +(hs), 7, 124);
  }
	pipeToPlace.render(ctx);
  for (var j = 0; j < board.length; j++)
  {
    if(board[j] != 0)
    {
      board[j].render(ctx);
    }
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

//gets a random number between a min and a max, code found on stack overflow
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearWaterBoard()
{
    for (var i = 0; i < (15*10); i++)
    {
      waterBoard[i] = 0; //sets the values of the board to zero to indicate they are empty
    }
}

//checks to see if water can flow right
function checkRight(loc)
{
  if(((loc+1)%15) != 0 || loc == 0)
  {
    if(board[loc + 1] != 0 && board[loc].sideOpen.right == true && board[loc + 1].sideOpen.left == true)
    {
      if(board[loc].justFilled == false)
      {
        if(waterBoard[loc + 1] == 0)
        {
          board[loc + 1].justFilled = true;
          waterBoard[loc + 1] = 1;
          board[loc + 1].empty = false;
          flowCount++;
          if(board[loc + 1].end)
          {
            newLevel();
            leveled = true;
          }
          return true;
        }     
      }
    }
  }
  return false;
}

//checks to see if water can flow left
function checkLeft(loc)
{
  if(loc != 0 || (loc%15) != 0)
  {
    if(board[loc - 1] != 0 && board[loc].sideOpen.left == true && board[loc - 1].sideOpen.right == true)
    {
      if(board[loc].justFilled == false)
      {
        if(waterBoard[loc - 1] == 0)
        {
          board[loc - 1].justFilled = true;
          waterBoard[loc - 1] = 1;
          board[loc - 1].empty = false;
          flowCount++;
          return true;
        } 
      }      
    }
  }
  return false; 
}

//checks to see if water can flow up
function checkAbove(loc)
{
  if(loc >= 15)
  {
    if(board[loc - 15] != 0 && board[loc].sideOpen.top == true && board[loc - 15].sideOpen.bottom == true)
    {
      if (board[loc].justFilled == false)
      {
        if(waterBoard[loc - 15] == 0)
        {
          board[loc - 15].justFilled = true;
          waterBoard[loc - 15] = 1;
          board[loc - 15].empty = false;
          flowCount++;
          return true;
        }  
      }
      
    }
  }
  return false;
}

//checks to see if water can flow down
function checkBelow(loc)
{
  if(loc <= 134)
  {
    if(board[loc + 15] != 0 && board[loc].sideOpen.bottom == true && board[loc + 15].sideOpen.top == true)
    {
      if(board[loc].justFilled == false)
      {
        if(waterBoard[loc + 15] == 0)
        {
          board[loc + 15].justFilled = true;
          waterBoard[loc + 15] = 1;
          flowCount++;
          board[loc + 15].empty = false;
          if(board[loc+15].end)
          {
            newLevel();
            leveled = true;
          }       
          return true;
        }  
      }
    }
  }
  return false;
}

function newLevel()
{
  if(board[148].empty == false || board[134].empty == false)
  {
    levelUp.play();
    clearBoard();
    clearWaterBoard();
    score += (level * 10);
    level++;
    flowRate -= 200;
    headStart = 7000;
    flowing = false;
    timer = 0;
    for(var i = 0; i<board.length; i++)
    {
      if(board[i] != 0)
      {
        board[i].empty = true;
        board[i].justFilled = false;
      }
    }
  }
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
    this.justFilled = false;
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

Pipe.prototype.rotate = function()
{
    switch(this.pipeID)
    {
        case 1:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 63;
            this.sourceRect.y = 32;
            this.pipeID = 2;
            break;
        case 2:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 63;
            this.sourceRect.y = 64;
            this.pipeID = 3;
            break;
        case 3:     
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 31;
            this.sourceRect.y = 64;
            this.pipeID = 4;
            break;
        case 4:          
            this.sideOpen.top = false;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 32;
            this.pipeID = 1;
            break;
        case 5:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 63;
            this.sourceRect.y = 96;
            this.pipeID = 6;
            break;
        case 6:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 63;
            this.sourceRect.y = 128;
            this.pipeID = 7;
            break;
        case 7:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 128;
            this.pipeID = 8;
            break;
        case 8:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 96;
            this.pipeID = 5;
            break;
        case 9:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 95;
            this.sourceRect.y = 64;
            this.pipeID = 10;
            break;
        case 10:        
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 95;
            this.sourceRect.y = 32;
            this.pipeID = 9;
            break;
    }
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
