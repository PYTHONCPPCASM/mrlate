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
        this.sound.play('bgm');
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
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        this.add.image(960,540, 'background').setOrigin(0.5, 0.5);
        
        this.addObject();
        this.main.setBounce(0);
        this.main.setCollideWorldBounds(true);

        this.main.body.setGravityY(700);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.main, this.port, this.log, null, this);
     
        this.add.text(200, 200, 'press K');

    }

    update(){

        this.controlMain();
        this.checkGameOver();

        this.physics.add.overlap(this.main, this.stars, this.collectStar, null, this);
        
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
        }
        if(this.cursors.down.isDown){
            this.main.setVelocityY(1000);
        }

    }

    addObject(){

        this.port = this.physics.add.sprite(500, 100, 'port');
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

    log(){
        this.scene.start('homeScene');
    }

    checkGameOver(){
        if(this.main.y >= 900){
            this.scene.start('homeScene');
        }
    }

    loadVisualAssets(){
        this.load.image('late', './assets/walkingSheet.png');
        this.load.image('background', './assets/scene1.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('gold', './assets/gold.png');
        this.load.image('port', './assets/port.png');
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
    }

}