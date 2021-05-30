class Tutorial extends Phaser.Scene{

    constructor(){
        super('playScene');
    }

    preload(){
        
        //load visual assets
        this.loadVisualAssets();
        //load sound assets
        this.loadSFX();

    }

    create(){
        //this will determine the direction of the bullet
        this.fire = false;
        this.left = false;
        this.right = true;
        this.ready = false;
        this.win = false;

        this.playBGM();
        this.createAnimation();
        //bindKeys
        this.bindKeys();
        this.addObject();
        this.addGameStats();

    }

    update(){

        this.main.body.setGravityY(300);  //you can jump in such height
    
        if(this.ready == true){
            this.controlMain();
        }

        this.ghostMovement();
        this.checkGameOver();
        this.collisionManagement();
        this.checkWin();

    }

    createAnimation(){

        this.anims.create({
            key: 'walkLeft',
            frames: this.anims.generateFrameNumbers('goLeft', { start: 0, end: 7, first: 0}),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('goRight', { start: 0, end: 7, first: 0 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'facingRight',
            frames: this.anims.generateFrameNumbers('goRight', { start: 0, end: 0, first: 0}),
            frameRate: 13,
            repeat: -1
        });

    }

    bindKeys(){

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.back = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        FIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 
    }

    //colliding reusable/update
    collisionManagement(){

        this.physics.add.collider(this.main, this.gold, this.collectStar, null, this);
        this.physics.add.collider(this.main, this.hearts, this.collectHearts, null, this);
        this.physics.add.collider(this.main, this.ghost, this.hitGhost, null, this);
        this.physics.add.collider(this.main, this.ghost2, this.hitGhost, null, this);

    }

    //control of the main character
    controlMain(){
        //control movement
        if(this.cursors.left.isDown){
            this.main.setVelocityX(-320);
            this.main.anims.play('walkLeft', true);
            this.left = true;
            this.right = false;
        } else if(this.cursors.right.isDown){
            this.main.setVelocityX(320);
            this.main.anims.play('walkRight', true);
            this.right = true;
            this.left = false;
        } else {
            
            this.main.setVelocityX(0);
            if( this.left == true && this.right == false){
                this.main.anims.play('walkLeft');
            } else if(this.left == false && this.right == true) {
                this.main.anims.play('walkRight');
            }

        }
        //
        if(this.cursors.up.isDown && this.main.body.touching.down){
            this.main.setVelocityY(-320);
            this.sound.play('jump');
        }

        if(this.cursors.down.isDown){
            this.main.setVelocityY(200);
        }

        if(Phaser.Input.Keyboard.JustDown(FIRE)){
            
            console.log('fire!');
            
            this.bullet = this.physics.add.sprite(this.main.x, this.main.y, 'bullet');
            
                if(this.left == true && this.right == false){
                    this.bullet.setVelocityX(-500);
                } else if(this.right === true && this.left == false) {
                    this.bullet.flipX = true;
                    this.bullet.setVelocityX(500);
                }

            this.sound.play('ting');
            
            if(this.bullet.x >= 1280 || this.bullet.x <= 0 || this.bullet.y >= 800 || this.bullet.y <= 0){
                this.bullet.destroy();
                console.log('bullet destroy()');
            }

            //bullet can always kill ghost
            this.physics.add.collider(this.bullet, this.ghost, this.killGhost, null, this);
            this.physics.add.collider(this.bullet, this.ghost2, this.killGhost, null, this);
            
        }

    }
    //level design happens here

    addGameStats(){
    this.level = this.add.text(1000, 700, 'level 1', titleConfig);
    numberOfHearts = 0;
    //countDown
    initialTime = 30;
    this.countDown();

     //heart stats
     this.add.image(1120, 30, 'heart').setOrigin(0.5, 0.5);
     this.heartCollected = this.add.text(1200, 30, numberOfHearts + '/' + heartsTarget).setOrigin(0.5, 0.5);
     this.heartCollected.setStyle(scoreConfig);

    }

    countDown(){
        this.text = this.add.text(32, 32, 'Countdown : ' + initialTime);
    //set style
    this.text.setStyle(titleConfig);
    //for each second
    this.timedEvent = this.time.addEvent({
        delay : 1000,
        callback : this.onEvent,
        callbackScope : this,
        loop : true
    });
    }

    addObject(){
        
        this.dialog();
        this.enemydirection = -1;
        numberOfGhost = 0;
        this.add.image(1194,834, 'wall').setOrigin(0.5, 0.5);

        //adding the platform group
        this.groundGroup = this.physics.add.staticGroup();
        this.groundGroup.create(100, 600, 'longPlatform');
        this.groundGroup.create(300, 500, 'longPlatform');
        this.groundGroup.create(400, 330, 'shortPlatform');
        //this.groundGroup.create(500, 400, 'shortPlatform').refreshBody();
        this.groundGroup.create(700, 300, 'longPlatform').refreshBody();
        this.groundGroup.create(1000, 200, 'longPlatform').refreshBody();
        //this.movingPlatform = this.groundGroup.create(700, 600, 'longPlatform').refreshBody();

        //adding the main character
        
        this.main = this.physics.add.sprite(50, 300, 'goLeft').setScale(1.0).setOrigin(0.5, 0.5);
        //this.ghost = this.physics.add.sprite(600, 180, 'ghost');
       
        this.ghostGroup = this.physics.add.staticGroup();
        this.ghost = this.physics.add.sprite(600, 180, 'ghost');
        this.ghost2 = this.physics.add.sprite(300, 400, 'ghost');
        
        console.log(this.ghost.x);
        //group of hearts
        this.hearts = this.physics.add.group({
            key : 'heart',
            repeat : 3,
            setXY : {x : 130, y : 0, stepX : 100, stepY : 0}
        });
        this.hearts.children.iterate(function (child) {
            child.refreshBody();
            child.setGravityY(300);
        });


        //set colliding enabled
        
        this.physics.add.collider(this.main, this.groundGroup);   //main walking on ground
        //this.physics.add.collider(this.books, this.groundGroup);
        this.physics.add.collider(this.hearts, this.groundGroup);
        //this.physics.add.collider(this.gold, this.groundGroup);
        this.physics.add.collider(this.main, this.groundPlatform);
        
        this.dialog();

        //turning the direction of the 

        this.oscillate = setInterval(()=>{
            this.enemydirection *= -1;
            console.log(this.enemydirection);
            this.ghost.flipX = true;
            this.ghost2.flipX = true;
            console.log(this.ghost.body.x);
        }, 3000);

    }

    onEvent(){
        initialTime -= 1;
        this.text.setText('Countdown : ' + initialTime, titleConfig);
    }

    collectHearts(player, heart){
        this.sound.play('ding');
        this.heartCollected.setStyle(scoreConfig);
        if(this.win == false){
            numberOfHearts += 1;
            heart.disableBody(true, true);
            this.heartCollected.setText(numberOfHearts + '/' + heartsTarget);
        }
    }

    warp(player, candy){
        player.setVelocityX(0);
        player.setVelocityY(0);
        candy.disableBody();
        candy.destroy();
        this.bgm.stop();
        this.sound.play('fall');
        this.add.rectangle(borderX / 2, borderY / 2 , 1280, 800, '#000000');
        this.add.text(640, 400, 'you have cleared the stage,'
                               + '\nsending you to the next stage...',
                                 titleConfig).setOrigin();
        this.win = true;
        this.ready = false;
        this.time.delayedCall(1400, ()=>{
            this.scene.start('playScene2');
        });
    }

    checkGameOver(){
        if(this.main.y >= 800 || initialTime < 0){
            this.levelManagement(this.main);
        }
    }

    sendingYou(){
        this.add.rectangle(borderX / 2, borderY / 2 , 1280, 800, '#000000');
        this.add.text(borderX / 2, borderY / 2, "sending you to the next stage...");
        this.ready = false;
    }

    loadVisualAssets(){
        this.load.image('ghost', './assets/ghost.png');
        this.load.image('girl', './assets/girl.png');
        this.load.image('bullet', './assets/bullet.png');
        this.load.image('late', './assets/kid.png');
        this.load.image('background', './assets/scene1.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('gold', './assets/gold.png');
        this.load.image('port', './assets/port.png');
        this.load.image('wall', './assets/towerbackground.png');
        this.load.image('book', './assets/book.png');
        this.load.image('heart', './assets/heart.png');
        this.load.image('longPlatform', './assets/longPlatform.png');
        this.load.image('shortPlatform', './assets/shortPlatform.png');
        this.load.image('candy', './assets/candy.png');
        // this.load.image('goLeft', './assets/goLeft.png');
        // this.load.image('goRight', './assets/goRight.png');

        this.load.spritesheet('kid', './assets/kid.png', {
            frameWidth:32,
            frameHeight:64,
            startFrame:0,
            endFrame:2,
            repeat: -1
        });
        //slicing the spritesheet
        this.load.spritesheet('goLeft', './assets/goLeft.png', {
            frameWidth:32,
            frameHeight:64,
            startFrame:0,
            endFrame:7,
            repeat: -1
        });

        this.load.spritesheet('goRight', './assets/goRight.png', {
            frameWidth:32,
            frameHeight:64,
            startFrame:0,
            endFrame:7,
            repeat: -1
        });

    }

    loadSFX(){
        this.load.audio('ting', './assets/coinpickup.wav');
        this.load.audio('bgm', './assets/backgroundmusic.wav');
        this.load.audio('footstep', './assets/footstep.wav');
        this.load.audio('jump', './assets/jump.wav');
        this.load.audio('fall', './assets/fall.wav');
        this.load.audio('ding', './assets/ding.wav');
    }

    playBGM(){
        console.log('bgm1');
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

    checkWin(){
        if(numberOfHearts == 3){
            this.hearts.clear(this);
            this.candy = this.physics.add.sprite(1000, 150, 'candy').setOrigin(0.5, 0.5);
            this.sound.play('fall');
            this.heartCollected.setText(3 + '/3');
            numberOfHearts = 0;
            this.physics.add.collider(this.main, this.candy, this.warp, null, this);
        }
    }

    dialog(){
        this.word = this.add.text(35, 100, 'Objective : collect 3 Hearts', titleConfig);
         this.time.delayedCall(3000, ()=>{
             this.ready = true;
         });
    }

    hitGhost(subject, object){
        if(object){
            object.destroy();
        }
        //use disableBody
        this.main.disableBody();
        this.sound.play('ding');
        this.ready = false;
        this.bgm.stop();
        clearInterval(this.oscillate);
        this.add.rectangle(borderX / 2, borderY / 2, borderX, borderY, '#FFFFFF').setOrigin(0.5, 0.5);
        
        this.gameRestart = this.add.text(borderX / 2, borderY / 2, 'you have kill by the death\n'
                                                                 + 'game restart in 3s',
                                                    titleConfig).setOrigin(0.5, 0.5);
        this.time.delayedCall(3000, ()=>{
            this.scene.start();
        });
    }

    killGhost(bullet, ghost){
        ghost.destroy();
        bullet.destroy();
        this.sound.play('ding');
    }

    levelManagement(subject, object){
        if(object){
            object.destroy();
        }
        clearInterval(this.oscillate);
        this.ready = false;
        this.bgm.stop();
        this.add.rectangle(borderX / 2, borderY / 2, borderX, borderY, '#FFFFFF').setOrigin(0.5, 0.5);
        this.gameRestart = this.add.text(borderX / 2, borderY / 2, 'game over\n'
                                                                 + 'game restart in 3s',
                                                    titleConfig).setOrigin(0.5, 0.5);
        this.time.delayedCall(3000, ()=>{
            this.scene.start();
        });
    }

    ghostMovement(){
        this.ghost.x += 1 * this.enemydirection;
        this.ghost2.x += 1 * this.enemydirection;
    }

}