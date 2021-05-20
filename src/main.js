let config = {
    type: Phaser.WEBGL,
    pixelArt:true,
    width: 1920,
    height: 1400,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { x : 0, y: 0 }
        }
    },
    scene: [ Menu, System, Play, Home, GameOver ]
};

let game = new Phaser.Game(config);

let borderX = game.config.width;
let borderY = game.config.height;

let keyLEFT, keyRIGHT, keyUP, keyDOWN, FIRE;

let warped = false;
let initialTime = 150;
this.gameOver = false;