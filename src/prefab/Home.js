class Home extends Phaser.Scene{
    constructor(){
        super('homeScene');
    }

    preload(){
        
        this.load.image('late', './assets/walkingSheet.png');
        this.load.image('background', './assets/scene1.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('gold', './assets/gold.png');
        this.load.image('port', './assets/port.png');

        //make a sprite sheet call walk
        this.load.spritesheet('walk', './assets/walkingSheet.png',{
            frameWidth: 108,
            frameHeight: 192,
            startFrame: 0,
            endFrame: 3,
            repeat: -1
        });

        this.load.spritesheet('count', './assets/count.png' ,{
            frameWidth: 48,
            frameHeight: 48,
            startFrame: 0,
            endFrame: 3,
            repeat: -1
        });

    }

    create(){
        
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('walk', {start: 0, end: 3, first: 0}),
            frameRate: 13,
            repeat: -1
        });

        this.main = this.physics.add.sprite(200, 400, 'walk');
        this.main.anims.play('move');

        this.cam = this.cameras.main;
    }

}