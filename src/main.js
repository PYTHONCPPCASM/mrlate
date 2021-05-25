let config = {
    type: Phaser.WEBGL,
    pixelArt:true,
    width: 1280,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { x : 0, y: 0 }
        }
    },
    scene: [ Menu, System, Tutorial, Home, GameOver, Turning, Dialog ]
};

let game = new Phaser.Game(config);

let borderX = game.config.width;
let borderY = game.config.height;

let keyLEFT, keyRIGHT, keyUP, keyDOWN, FIRE;

let warped = false;
let initialTime = 150;
let gameOver = false;
let gotTicket = false;  //this will determine if the player can proceed to the next level
let bulletrange = 400;
let fire = false;

//global variable for each
let numberOfHearts = 0;
let numberOfGold = 0;
let numberOfBooks = 0;
let heartsTarget = 3;
let goldTarget = 3;
let booksTarget = 3;

let titleConfig = {
    fontFamily: 'menlo',
    fontSize:'38px',
    color: '#FFFFFF',
    align: 'left',
    padding:{
    top: 0,
    bottom: 0,
    left: 0
 },
};

let scoreConfig = {
    fontFamily: 'menlo',
    fontSize:'38px',
    color: '#FFFFFF',
    align: 'left',
    padding:{
    top: 0,
    bottom: 0,
    left: 30
},
    fixedWidth: 100
};