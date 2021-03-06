/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// var Controller = require("./modules/Controller");
// var DataController = require("./modules/DataController");
// var UiController = require("./modules/UiController");
// console.log(Controller);

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function ( /* function */callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

var myObstacle;
var myGamePiece;
var myGameArea;
var ctx;

function startGame() {
    /* instanciate new gameComponent */
    myGamePiece = new GameComponent(30, 30, "red", 10, 120);
    myGameArea = new GameArea(480, 270);
    myObstacle = new GameComponent(10, 200, "green", 300, 120);
    myGameArea.start();
}

function GameArea(width, height) {
    this.width = width;
    this.height = height;
}

/**
 * initialising canvas, and evenlisteners
 * @return {[type]} [description]
 */
GameArea.prototype.start = function () {
    this.canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");
    this.fps = 50;
    this.then = Date.now();
    this.fpsInterval = 1000 / this.fps;
    this.startTime = this.then;

    window.addEventListener("keydown", function (e) {
        myGameArea.keys = myGameArea.keys || [];
        myGameArea.keys[e.keyCode] = e.type == "keydown";
    });
    window.addEventListener("keyup", function (e) {
        myGameArea.keys[e.keyCode] = e.type == "keydown";
    });

    // window.addEventListener('touchmove', function (e) {
    //         myGameArea.x = e.touches[0].screenX;
    //         myGameArea.y = e.touches[0].screenY;
    //     })
    // window.addEventListener("mousemove", function(e) {
    //     myGamePiece.x = e.pageX;
    //     myGamePiece.y = e.pageY;
    // });

    this.update();
};

GameArea.prototype.update = function () {
    // request another frame
    window.requestAnimFrame(this.update.bind(this));

    // calc elapsed time since last loop
    this.now = Date.now();
    this.elapsed = this.now - this.then;

    // if time has elapsed, draw next frame
    if (this.elapsed > this.fpsInterval) {
        this.then = this.now - this.elapsed % this.fpsInterval;

        this.clear();

        myGamePiece.speedY = 0;
        myGamePiece.speedX = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {
            myGamePiece.speedX = -1;
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            myGamePiece.speedX = 1;
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            myGamePiece.speedY = -1;
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            myGamePiece.speedY = 1;
        }
        myGamePiece.newPos();

        if (myGamePiece.isCollisionWith(myObstacle)) {
            myGamePiece.crash();
        }
        myGamePiece.update();
        myObstacle.update();
    }
};

GameArea.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

GameArea.prototype.stop = function () {
    // TODO clear interval
};

/**
 * object contructor: gameComponent
 * allows to add gameComponents onto the gamearea
 */

function GameComponent(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.color = color;
}

GameComponent.prototype.update = function () {
    ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

GameComponent.prototype.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
};

GameComponent.prototype.crash = function () {
    this.color = "green";
};

GameComponent.prototype.isCollisionWith = function (objToTest) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = objToTest.x;
    var otherright = objToTest.x + objToTest.width;
    var othertop = objToTest.y;
    var otherbottom = objToTest.y + objToTest.height;
    var crash = true;
    if (mybottom < othertop || mytop > otherbottom || myright < otherleft || myleft > otherright) {
        crash = false;
    }
    return crash;
};

startGame();

/***/ })
/******/ ]);