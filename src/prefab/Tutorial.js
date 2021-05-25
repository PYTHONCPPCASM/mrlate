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
        
        this.anims.create({
            key:'count',
            frames: this.anims.generateFrameNumbers('count', {start: 0, end: 0, first: 0}),
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

        this.physics.add.overlap(this.main, this.gold, this.collectStar, null, this);
        //this.physics.add.overlap(this.main, this.books, this.collectBooks, null, this);
        this.physics.add.overlap(this.main, this.hearts, this.collectHearts, null, this);
        //this.physics.add.collider(this.groundGroup, this.gold, this.hittingGround, null, this);

    }

    //control of the main character
    controlMain(){

        if(this.cursors.left.isDown){
            this.main.setVelocityX(-320);
            this.main.anims.play('walkLeft', true);
            this.left = true;
            this.right = false;
            console.log(this.right);
            console.log(this.left);
        } else if(this.cursors.right.isDown){
            this.main.setVelocityX(320);
            this.main.anims.play('walkRight', true);
            this.right = true;
            this.left = false;
            console.log(this.right);
            console.log(this.left);
        } else {
            this.main.setVelocityX(0);
            if( this.left == true && this.right == false){
                this.main.anims.play('walkLeft');
            } else if(this.left == false && this.right == true) {
                this.main.anims.play('walkRight');
            }
            
        }

        if(this.cursors.up.isDown && this.main.body.touching.down){
            this.main.setVelocityY(-400);
            this.sound.play('jump');
        }

        if(this.cursors.down.isDown){
            this.main.setVelocityY(300);
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

            this.physics.add.overlap(this.bullet, this.hearts, this.shootHearts, null, this);
            // this.physics.add.collider(this.bullet, this.gold, this.shootStar, null, this);
            // this.physics.add.collider(this.bullet, this.books, this.shootBooks, null, this);
            
        }

    }
    //level design happens here

    addGameStats(){
    numberOfHearts = 0;
    // numberOfGold = 0;
    // numberOfBooks = 0;
    //place a text
    initialTime = 30;
    this.text = this.add.text(32, 32, 'Countdown : ' + 'INF');
    //set style
    this.text.setStyle(titleConfig);
    //for each second
    this.timedEvent = this.time.addEvent({
        delay : Infinity,
        callback : this.onEvent,
        callbackScope : this,
        loop : true
    });

     //heart stats
     this.add.image(1120, 30, 'heart').setOrigin(0.5, 0.5);
     this.heartCollected = this.add.text(1200, 30, numberOfHearts + '/' + heartsTarget).setOrigin(0.5, 0.5);
     this.heartCollected.setStyle(scoreConfig);

     //gold stats
    //  this.add.image(990, 30, 'gold').setOrigin(0.5, 0.5);
    //  this.goldCollected = this.add.text(1070, 30, numberOfHearts + '/' + goldTarget).setOrigin(0.5, 0.5);
    //  this.goldCollected.setStyle(scoreConfig);

    //  //book stats
    //  this.add.image(830, 30, 'book').setOrigin(0.5, 0.5);
    //  this.bookCollected = this.add.text(910, 30, numberOfBooks + '/' + booksTarget).setOrigin(0.5, 0.5);
    //  this.bookCollected.setStyle(scoreConfig);

    }

    addObject(){
        
        this.dialog();

        this.add.image(1194,834, 'wall').setOrigin(0.5, 0.5);

        //adding the platform group
        this.groundGroup = this.physics.add.staticGroup();
        //this.groundPlatform = this.groundGroup.create(500, 788, 'longPlatform').refreshBody();
        this.groundGroup.create(100, 700, 'longPlatform');
        this.groundGroup.create(300, 500, 'longPlatform');
        this.groundGroup.create(500, 400, 'shortPlatform').refreshBody();
        this.groundGroup.create(700, 200, 'longPlatform').refreshBody();
        this.groundGroup.create(1000, 200, 'longPlatform').refreshBody();
        //this.movingPlatform = this.groundGroup.create(700, 600, 'longPlatform').refreshBody();

        //adding the main character
        this.main = this.physics.add.sprite(300, 300, 'goLeft').setScale(2.0);

        //add book for picking up
        // 

        //add gold for picking up
        // this.gold = this.physics.add.group({
        //     key: 'gold',
        //     repeat: 2,
        //     setXY: { x: 200, y: 300, stepX: 0, stepY: 100 }
        // });
        // //for each gold placed
        // this.gold.children.iterate(function (child) {     
        //     child.refreshBody();
        // });

        //add heart for picking up
       this.hearts = this.physics.add.group({
            key : 'heart',
            repeat : 10,
            setXY : {x : 100, y : 0, stepX : 100, stepY : 0}
        });
        this.hearts.children.iterate(function (child) {
            child.refreshBody();
            child.setGravityY(300);
        });
        

        //set colliding enabled
        
        this.physics.add.collider(this.main, this.groundGroup);   //main collid
        //this.physics.add.collider(this.books, this.groundGroup);
        this.physics.add.collider(this.hearts, this.groundGroup);
        //this.physics.add.collider(this.gold, this.groundGroup);  //group collide
        this.physics.add.collider(this.main, this.groundPlatform);
        
        this.dialog();

        //how to use time event to make count down, from internet
    }
    //countDown event
    onEvent(){
        initialTime -= 1;
        this.text.setText('Countdown : ' + initialTime, titleConfig);
    }

    //things that happen when collecting golds
    // collectStar(player,gold){
    //     numberOfGold += 1;
    //     this.goldCollected.setText(numberOfGold + '/' + goldTarget);
    //     gold.disableBody(true, true);
    //     gold.destroy();
    //     this.sound.play('ding');
    //     console.log('collect gold');
    //     initialTime -= 5;
    // }
    // //things that happen when collecting books
    // collectBooks(player, book){
    //     numberOfBooks += 1;
    //     this.bookCollected.setText(numberOfBooks + '/' + booksTarget);
    //     book.disableBody(true, true);
    //     this.sound.play('ding');
    // }
    //things that happen when collecting hearts

    createHearts(){
        
    }

    collectHearts(player, heart){
        numberOfHearts += 1;
        heart.disableBody(true, true);
        this.sound.play('ding');
        this.heartCollected.setText(numberOfHearts + '/' + heartsTarget);
        this.heartCollected.setStyle(scoreConfig);
    }
    //bullet action when hitting hearts
    // shootHearts(bullet, heart){
    //     heart.disableBody(true, true);
    //     this.sound.play('ting');
    //     bullet.destroy();
    // }

    // shootStar(bullet, star){
    //     star.disableBody(true, true);
    //     this.sound.play('ting');
    //     bullet.destroy();
    // }

    // shootBooks(bullet, book){
    //     book.disableBody(true, true);
    //     this.sound.play('ting');
    //     bullet.destroy();
    // }

    warp(){
        this.scene.start('homeScene');
        this.bgm.stop();
        this.sound.play('fall');
    }

    checkGameOver(){
        if(this.main.y >= 800 || initialTime < 0){
            this.levelManagement();
        }
    }

    loadVisualAssets(){
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

        this.load.spritesheet('count', './assets/count.png' , {
            frameWidth: 48,
            frameHeight: 48,
            startFrame: 0,
            endFrame: 2,
            repeat: -1
        });
    }

    //please load animations here
    // createAnimation(){
    //     this.load.spritesheet('left', './assets/kid.png', {
    //         frameWidth: 42,
    //         frameHeight: 78,
    //         startFrame: 0,
    //         endFrame: 1,
    //         repeat: -1
    //     });
    //     this.load.spritesheet('right', './assets/kid.png', {
    //         frameWidth: 42,
    //         frameHeight: 78,
    //         startFrame: 1,
    //         endFrame: 2,
    //         repeat: -1
    //     });
    //     this.load.spritesheet('mid', './assets/kid.png', {
    //         frameWidth:42,
    //         frameHeight:78,
    //         startFrame:1,
    //         endFrame:1,
    //         repeat: -1
    //     });

    //     this.load.spritesheet('count', './assets/count.png' , {
    //         frameWidth: 48,
    //         frameHeight: 48,
    //         startFrame: 0,
    //         endFrame: 2,
    //         repeat: -1
    //     });
    // }

    loadSFX(){
        this.load.audio('ting', './assets/coinpickup.wav');
        this.load.audio('bgm', './assets/backgroundmusic.wav');
        this.load.audio('footstep', './assets/footstep.wav');
        this.load.audio('jump', './assets/jump.wav');
        this.load.audio('fall', './assets/fall.wav');
        this.load.audio('ding', './assets/ding.wav');
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

    checkWin(){
        if(numberOfHearts == 3){
            //this.port = this.physics.add.sprite(1200, 200, 'port').refreshBody();
            //there will be a candy once condition is reached
            this.candy = this.physics.add.sprite(1000, 150, 'candy').setOrigin(0.5, 0.5);
            this.sound.play('fall');
            this.heartCollected.setText(numberOfHearts + '/3');
            numberOfHearts = 0;
            numberOfGold = 0;
            numberOfBooks = 0;
            //able to let the play go, and can set where to go in function warp()
            this.physics.add.collider(this.main, this.candy, this.warp, null, this);
            return;
        }
    }

    dialog(){
        this.black = this.add.rectangle(0, 0, 2560, 1600, '#000000').setOrigin(0.5, 0.5);
        this.word = this.add.text(borderX / 2, borderY / 2, 'I still remember the time\n' + 
                                                            'when I was a little kid \n' + 
                                                            'mom said :\n  "don\'t fall off the stair,\n' + 
                                                            ' I love you"',
                                                            titleConfig).setOrigin(0.5, 0.5);
        this.time.delayedCall(3000, ()=>{
            this.black.destroy();
            this.word.destroy();
            this.ready = true;
        });
    }

    levelManagement(){

        this.ready = false;
        this.bgm.stop();
        
        this.add.rectangle(borderX / 2, borderY / 2, borderX, borderY, '#FFFFFF').setOrigin(0.5, 0.5);
        this.gameRestart = this.add.text(borderX / 2, borderY / 2, 'you fall off the stairs\n'
                                                                 + 'game restart in 3s',
                                                    titleConfig).setOrigin(0.5, 0.5);

        this.time.delayedCall(3000, ()=>{
            this.scene.restart();
        });

    }

}