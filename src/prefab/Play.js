class Play extends Phaser.Scene{

    constructor(){
        super('playScene');
    }

    preload(){
        
        //load visual assets
        this.loadVisualAssets();
        //create animation
        this.createAnimation();
        //load sound assets
        this.loadSFX();

    }

    create(){
        
        this.playBGM();
       
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 3, first: 0}),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key:'count',
            frames: this.anims.generateFrameNumbers('count', {start: 0, end: 3, first: 0}),
            frameRate: 13,
            repeat: -1
        });

        //add coins
        
        //bindKeys
        this.bindKeys();
        this.addObject();

        this.main.setBounce(0);
        this.main.setCollideWorldBounds(true);

        this.main.body.setGravityY(700);

    }

    update(){

        this.controlMain();
        this.checkGameOver();
        this.collisionManagement();

    }

    bindKeys(){
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.back = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    collisionManagement(){
        this.physics.add.overlap(this.main, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.main, this.port, this.warp, null, this);
    }

    controlMain(){

        if(this.cursors.left.isDown){
            this.main.setVelocityX(-320);
            this.main.anims.play('move', true);
        } else if(this.cursors.right.isDown){
            this.main.setVelocityX(320);
            this.main.anims.play('move', true);
        } else {
            this.main.setVelocityX(0);
            this.main.anims.play('move');
        }

        if(this.cursors.up.isDown && this.main.body.touching.down){
            this.main.setVelocityY(-900);
            this.sound.play('jump');
        }

        if(this.cursors.down.isDown){
            this.main.setVelocityY(1000);
        }

    }

    addObject(){

        this.add.image(540,773, 'wall').setOrigin(0.5, 0.5);
        
        this.port = this.physics.add.sprite(200, 100, 'port');
        this.main = this.physics.add.sprite(300, 300, 'walk');

        this.groundGroup = this.physics.add.staticGroup();

        let randomHorizontal = Phaser.Math.Between(200, 600);
        let randomHeight = Phaser.Math.Between(400, 1000);

        this.groundGroup.create(randomHorizontal, randomHeight, 'ground').setOrigin(0.5, 0.5);
        this.groundGroup.create(randomHorizontal, 1000, 'ground').setScale(3.0).refreshBody();
        this.groundGroup.create(randomHorizontal, randomHeight, 'ground').setOrigin(0.5, 0.5);

        this.stars = this.physics.add.group({
            key: 'gold',
            repeat: 4,
            setXY: { x: 100, y: -100, stepX: 100, stepY: 80 }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(3.0).refreshBody();
            child.setGravityY(300);
        });

        this.physics.add.collider(this.main, this.groundGroup);   //main collide
        this.physics.add.collider(this.stars, this.groundGroup);  //group collide
        this.physics.add.collider(this.port, this.groundGroup);
        this.port.setGravityY(300);

    }

    collectStar(player,star){
        star.disableBody(true, true);
        this.sound.play('ting');
    }

    warp(){
        this.scene.start('homeScene');
        this.bgm.stop();
        this.main.x -= + (this.port.x);
    }

    checkGameOver(){
        if(this.main.y >= 900){
            this.bgm.stop();
            this.scene.start('GameOver');
        }
    }

    loadVisualAssets(){
        this.load.image('late', './assets/walkingSheet.png');
        this.load.image('background', './assets/scene1.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('gold', './assets/gold.png');
        this.load.image('port', './assets/port.png');
        this.load.image('wall', './assets/wall.png');
        this.load.image('wallWindowed', './assets/wallWindowed.png');
    }

    //please load animations here
    createAnimation(){
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

    loadSFX(){
        this.load.audio('ting', './assets/coinpickup.wav');
        this.load.audio('bgm', './assets/backgroundmusic.wav');
        this.load.audio('footstep', './assets/footstep.wav');
        this.load.audio('jump', './assets/jump.wav');
    }

    playBGM(){
        this.bgm = this.sound.add('bgm');
        let loopConfig = {
            mute:false,
            volume:1,
            rate:1,
            detune:0,
            seek:0,
            loop:true,
            delay:0
        };
        this.bgm.play(loopConfig);
    }

}