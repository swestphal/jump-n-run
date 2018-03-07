// var Controller = require("./modules/Controller");
// var DataController = require("./modules/DataController");
// var UiController = require("./modules/UiController");
// console.log(Controller);

window.requestAnimFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

var myGamePiece;
var myGameArea;
var ctx;

function startGame() {
    /* instanciate new gameComponent */
    myGamePiece = new GameComponent(30, 30, "red", 10, 120);
    myGameArea = new GameArea(480, 270);
    myGameArea.start();
}

function GameArea(width, height) {
    this.width = width;
    this.height = height;
}
GameArea.prototype.start = function() {
    this.canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");
    window.addEventListener("keydown", function(e) {
        myGameArea.keys = myGameArea.keys || [];
        myGameArea.keys[e.keyCode] = e.type == "keydown";
    });
    window.addEventListener("keyup", function(e) {
        myGameArea.keys[e.keyCode] = e.type == "keydown";
    });

    this.update();
};
GameArea.prototype.update = function() {
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
    myGamePiece.update();

    var req = window.requestAnimFrame(this.update.bind(this));
};

GameArea.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

GameComponent.prototype.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
};

startGame();
