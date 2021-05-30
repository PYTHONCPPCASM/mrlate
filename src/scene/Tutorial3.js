class Tutorial3 extends Phaser.Scene{

    constructor(){
        super('playScene3');
    }

    preload(){
        
        //load visual assets
        this.loadVisualAssets();
        //load sound assets
        this.loadSFX();

    }

    create(){
        //this will determine the direction of the bullet
        this.timer = 0;
        numberOfBooks = 0;
        this.fire = false;
        this.left = false;
        this.right = true;
        this.ready = false;
        //this.playBGM();
        console.log('bgm 2');
        console.log('lolol');
        let loopConfig = {
            mute:false,
            volume:1,
            rate:1,
            detune:0,
            seek:0,
            loop:true,
            delay:0
        };
        this.bgm2 = this.sound.add('bgm2', loopConfig);
        this.bgm2.play();
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
        this.fire1.update();

    }

    createAnimation(){

        console.log("create animation");
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
        this.physics.add.collider(this.main, this.books, this.collectBooks, null, this);
        //ghost kills
        this.physics.add.collider(this.main, this.ghost, this.hitGhost, null, this);
        this.physics.add.collider(this.main, this.ghost2, this.hitGhost, null, this);
    }

    //control of the main character
    controlMain(){

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

        if(this.cursors.up.isDown && this.main.body.touching.down){
            this.main.setVelocityY(-300);
            this.sound.play('jump');
        }

        if(this.cursors.down.isDown){
            this.main.setVelocityY(200);
        }

        if(Phaser.Input.Keyboard.JustDown(FIRE)){
            
            console.log('fire!');
            
            this.bullet = this.physics.add.sprite(this.main.x, this.main.y, 'bullet').setScale(2.0);
            
                if(this.left == true && this.right == false){
                    this.bullet.flipX = true;
                    this.bullet.setVelocityX(-500);
                } else if(this.right === true && this.left == false) {
                    this.bullet.setVelocityX(500);
                }

            this.sound.play('ting');
            
            if(this.bullet.x >= 1280 || this.bullet.x <= 0 || this.bullet.y >= 800 || this.bullet.y <= 0){
                this.bullet.destroy();
                console.log('bullet destroy()');
            }
            
            this.physics.add.collider(this.bullet, this.ghost, this.killGhost, null, this);
            this.physics.add.collider(this.bullet, this.ghost2, this.killGhost, null, this);
            
        }

    }
    //level design happens here

    addGameStats(){
    this.level = this.add.text(1000, 700, 'level 3', titleConfig);
    initialTime = 30;
    //this.text = this.add.text(32, 32, 'Countdown : ' + 'INF');
    //set style
    //this.text.setStyle(titleConfig);
    //for each second
    // this.timedEvent = this.time.addEvent({
    //     delay : 1000,
    //     callback : this.onEvent,
    //     callbackScope : this,
    //     loop : true
    // });

     //book stats
     this.add.image(830, 30, 'book').setOrigin(0.5, 0.5);
     
     this.bookCollected = this.add.text(910, 30, numberOfBooks + '/' + 6).setOrigin(0.5, 0.5);
     this.bookCollected.setStyle(scoreConfig);

     this.add.image(670, 30, 'ghost').setOrigin(0.5, 0.5);
     this.ghostKilled = this.add.text(750, 30, numberOfGhost + '/' + 2).setOrigin(0.5, 0.5);
     this.ghostKilled.setStyle(scoreConfig);

    }

    addObject(){

        this.enemydirection = -1;
        this.add.image(1194,834, 'wall').setOrigin(0.5, 0.5);
        numberOfGhost = 0;
        //adding the platform group
        this.groundGroup = this.physics.add.staticGroup();
        this.groundGroup.create(150, 700, 'longPlatform');
        this.groundGroup.create(250, 600, 'shortPlatform');
        this.groundGroup.create(350, 500, 'shortPlatform').refreshBody();
        this.groundGroup.create(500, 400, 'shortPlatform').refreshBody();
        this.groundGroup.create(850, 300, 'shortPlatform').refreshBody();
        this.groundGroup.create(700, 200, 'shortPlatform').refreshBody();
        this.groundGroup.create(1000, 600, 'shortPlatform').refreshBody();
        

        //adding the main character
        this.main = this.physics.add.sprite(40, 600, 'goLeft').setScale(1.0);

        //add ghost
        this.ghost = this.physics.add.sprite(300, 400, 'ghost');
        this.ghost2 = this.physics.add.sprite(200, 300, 'ghost');
        //firing
        
        

        this.books = this.physics.add.group({
            key: 'book',
            repeat : 5,
            setXY : {x: 150, y: 600, stepX : 100, stepY : -100}
        });

        this.books.children.iterate((child)=>{
            child.refreshBody();
            child.setGravityY(300);
        });
        
        this.physics.add.collider(this.main, this.groundGroup);   //main walking on ground
        this.physics.add.collider(this.books, this.groundGroup);
        this.physics.add.collider(this.main, this.groundPlatform);
        

        this.oscillate = setInterval(()=>{
            this.enemydirection *= -1;
            console.log(this.enemydirection);
            this.ghost.flipX = true;
            this.ghost2.flipX = true;
            this.emitX = this.ghost.x;
            this.emitY = this.ghost.y;
            
        }, 3000);

        this.fire1 = new ghostFire(this, 200, 200, 'fire', 0, this.emitX);

        this.firingBullet();

        //how to use time event to make count down, from internet
        this.dialog();
    }
    //countDown event
    onEvent(){
        initialTime -= 1;
        this.text.setText('Countdown : ' + initialTime, titleConfig);
    }

    collectBooks(player, book){
        numberOfBooks += 1;
        this.bookCollected.setText(numberOfBooks + '/' + 6);
        book.disableBody(true, true);
        this.sound.play('ding');
    }

    hittingObject(subject, object){
        subject.destroy();
        object.destroy();
        this.sound.play('ding');
    }
   
    warp(player, gold){
        this.ready = false;
        player.setVelocityX(0);
        player.setVelocityY(0);
        gold.destroy();  // this is the key
        this.sound.play('fall');
        this.bgm2.stop();
        this.add.rectangle(borderX / 2, borderY / 2 , 1280, 800, '#000000');
        this.add.text(640, 400, 'you have cleared the stage,'
                               +'\nsending you to the next stage...',
                                 titleConfig).setOrigin();
        this.time.delayedCall(1400, ()=>{this.scene.start('homeScene');});
    }

    checkGameOver(){
        if(this.main.y >= 800){
            this.levelManagement();
        }
        if(initialTime < 0){
            this.levelManagement();
        }
    }

    loadVisualAssets(){

        this.load.image('background', './assets/scene1.png');
        this.load.image('bullet', './assets/bullet.png');
        this.load.image('book', './assets/book.png');
        this.load.image('candy', './assets/candy.png');
        this.load.image('fire', './assets/fire.png');
        this.load.image('ghost', './assets/ghost.png');
        this.load.image('girl', './assets/girl.png');
        this.load.image('gold', './assets/gold.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('heart', './assets/heart.png');
        this.load.image('late', './assets/kid.png');
        this.load.image('longPlatform', './assets/longPlatform.png');
        this.load.image('port', './assets/port.png');
        this.load.image('shortPlatform', './assets/shortPlatform.png');
        this.load.image('wall', './assets/towerbackground.png');

        this.load.spritesheet('kid', './assets/kid.png', {
            frameWidth:32,
            frameHeight:60,
            startFrame:0,
            endFrame:2,
            repeat: -1
        });

        //slicing the spritesheet
        this.load.spritesheet('goLeft', './assets/goLeft.png', {
            frameWidth:32,
            frameHeight:60,
            startFrame:0,
            endFrame:7,
            repeat: -1
        });

        this.load.spritesheet('goRight', './assets/goRight.png', {
            frameWidth:32,
            frameHeight:60,
            startFrame:0,
            endFrame:7,
            repeat: -1
        });
    }


    loadSFX(){
        this.load.audio('ting', './assets/coinpickup.wav');
        this.load.audio('bgm2', './assets/backgroundmusic.wav');
        this.load.audio('footstep', './assets/footstep.wav');
        this.load.audio('jump', './assets/jump.wav');
        this.load.audio('fall', './assets/fall.wav');
        this.load.audio('ding', './assets/ding.wav');
    }

    playBGM(){
        
    }

    //when collect enough books, the gold will show

    checkWin(){
        if(numberOfBooks == 6 && numberOfGhost == 2){
            this.gold = this.physics.add.sprite(1000, 550, 'gold').setOrigin(0.5, 0.5);
            numberOfHearts = 0;
            numberOfGold = 0;
            numberOfBooks = 0;
            this.physics.add.collider(this.main, this.gold, this.warp, null, this);
            return;
        }
    }

    dialog(){

        this.black = this.add.rectangle(0, 0, 2560, 1600, '#000000').setOrigin(0.5, 0.5);
        this.word = this.add.text(borderX / 2, borderY / 2, 'mom says : "education makes you wealthier\n' +
                                                            '"enough" isn\'t enough\n' + 
                                                            'and don\'t fall off the stair,\n' +
                                                            ' and I love you"',
                                                            titleConfig).setOrigin(0.5, 0.5);
        this.time.delayedCall(3000, ()=>{
            this.black.destroy();
            this.word.destroy();
            this.ready = true;
        });

    }

    levelManagement(message){

        this.ready = false;
        this.bgm2.stop();
        
        this.add.rectangle(borderX / 2, borderY / 2, borderX, borderY, '#FFFFFF').setOrigin(0.5, 0.5);
        this.gameRestart = this.add.text(borderX / 2, borderY / 2, message, titleConfig).setOrigin(0.5, 0.5);

        this.time.delayedCall(3000, ()=>{
            this.scene.start();
        });

    }

    killGhost(bullet, ghost){
        ghost.destroy();
        bullet.destroy();
        numberOfGhost += 1;
        this.ghostKilled.setText(numberOfGhost + '/' + 2);
        this.sound.play('ding');
        
    }

    ghostMovement(){
        this.ghost.x += 1 * this.enemydirection;
        this.ghost2.x += 1 * this.enemydirection;
    }

    firingBullet(){

    }   

    hitGhost(subject, object){
        if(object){
            object.destroy();
        }
        //use disableBody
        this.main.disableBody();
        this.sound.play('ding');
        this.ready = false;
        this.bgm2.stop();
        clearInterval(this.oscillate);
        this.add.rectangle(borderX / 2, borderY / 2, borderX, borderY, '#FFFFFF').setOrigin(0.5, 0.5);
        
        this.gameRestart = this.add.text(borderX / 2, borderY / 2, 'you have kill by the death\n'
                                                                 + 'game restart in 3s',
                                                    titleConfig).setOrigin(0.5, 0.5);
        this.time.delayedCall(3000, ()=>{
            this.scene.start();
        });
    }

}