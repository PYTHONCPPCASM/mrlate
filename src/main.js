let config = {
    type: Phaser.WEBGL,
    pixelArt:true,
    width: 1080,
    height: 1546,
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

let keyLEFT, keyRIGHT, keyUP, keyDOWN;

let warped = false;