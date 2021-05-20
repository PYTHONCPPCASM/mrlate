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
        //this will determine the direction of the bullet
        this.left = false;
        this.right = true;
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
        this.main.setCollideWorldBounds(false);

        this.main.body.setGravityY(500);  //you can jump in such height

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
        FIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 
    }

    collisionManagement(){

        this.physics.add.overlap(this.main, this.gold, this.collectStar, null, this);
        this.physics.add.collider(this.main, this.port, this.warp, null, this);
        this.physics.add.overlap(this.main, this.books, this.collectBooks, null, this);
        this.physics.add.overlap(this.main, this.hearts, this.collectHearts, null, this);
        this.physics.add.collider(this.gold, this.groundPlatform, this.hittingGround, null, this);
        this.physics.add.collider(this.groundGroup, this.girl, null, null, this);
        this.physics.add.collider(this.main, this.girl, ()=>{
            this.girl.disableBody(true, true);
            console.log('girl');
        }, null, this);
        

    }

    controlMain(){

        if(this.cursors.left.isDown){
            this.main.setVelocityX(-320);
            this.main.anims.play('move', true);
            this.left = true;
            this.right = false;
            console.log(this.right);
            console.log(this.left);
        } else if(this.cursors.right.isDown){
            this.main.setVelocityX(320);
            this.main.anims.play('move', true);
            this.right = true;
            this.left = false;
            console.log(this.right);
            console.log(this.left);
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

        if(Phaser.Input.Keyboard.JustDown(FIRE)){
            console.log('fire!');
            this.bullet = this.physics.add.sprite(this.main.x, this.main.y, 'bullet');
            if(this.left == true && this.right == false){
                this.bullet.setVelocityX(-500);
            } else if(this.right === true && this.left == false) {
                this.bullet.setVelocityX(500);
            }
            this.physics.add.overlap(this.bullet, this.hearts, this.collectHearts, null, this);
            this.physics.add.overlap(this.bullet, this.gold, this.collectStar, null, this);        
        }

    }

    addObject(){
        
        this.add.image(540,773, 'wall').setOrigin(0.5, 0.5);

        let randomHorizontal = Phaser.Math.Between(200, 700);
        let randomHeight = Phaser.Math.Between(540, 600);

        this.groundGroup = this.physics.add.staticGroup();

        this.groundPlatform = this.groundGroup.create(540, 1200, 'longPlatform').refreshBody();
        //this.groundGroup.create(randomHorizontal, randomHeight, 'longPlatform').setOrigin(0.5, 0.5);
        //this.groundGroup.create(randomHorizontal, randomHeight, 'longPlatform').setOrigin(0.5, 0.5);
        this.groundPlatform = this.groundGroup.create(500, 500, 'shortPlatform').refreshBody();
        
        //adding the main character
        this.main = this.physics.add.sprite(this.groundPlatform.x, randomHeight + this.groundPlatform.height, 'walk');

        this.port = this.physics.add.sprite(this.groundPlatform.x + 200, this.groundPlatform.y - 200, 'port').setScale(3.0).refreshBody();
        
        this.girl = this.physics.add.sprite(300, 500, 'girl').setOrigin(0.5, 0.5);
        this.girl.setGravityY(100);
        //add book for picking up
        this.books = this.physics.add.group({
            key: 'book',
            repeat: 2,
            setXY: { x: 100, y: 200, stepX : 40, stepY: 80}
        });
        this.books.children.iterate(function (child) {
            child.setScale(2.0).refreshBody();
        });

        //add gold for picking up
        this.gold = this.physics.add.group({
            key: 'gold',
            repeat: 2,
            setXY: { x: this.groundPlatform.x - this.groundPlatform.width , y: -100, stepX: 100, stepY: 80 }
        });
        this.gold.children.iterate(function (child) {      //set the physics attribute
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(2.0).refreshBody();
            child.setGravityY(300);
        });
        //add heart for picking up
        this.hearts = this.physics.add.group({
            key : 'heart',
            repeat : 2,
            setXY : {x : this.groundPlatform.x - 30, y : -300, stepX : 50, stepY : 35}
        });
        this.hearts.children.iterate(function (child) {
            child.setBounceY(0.3);
            child.setScale(2.0).refreshBody();
            child.setGravityY(300);
        })

        this.physics.add.collider(this.main, this.groundGroup);   //main collide
        this.physics.add.collider(this.port, this.groundGroup);
        this.physics.add.collider(this.books, this.groundGroup);
        this.physics.add.collider(this.hearts, this.groundGroup);
        this.physics.add.collider(this.gold, this.groundGroup);  //group collide
        
        this.physics.add.collider(this.main, this.groundPlatform);

        this.port.setGravityY(300);

        let titleConfig = {
            fontFamily: 'Noteworthy',
            fontSize:'38px',
            backgroundColor:'#F3B141',
            color: '#843605',
            align: 'left',
            padding:{
            top: 0,
            bottom: 0,
            left: 30
        },
            fixedWidth: 200
        };
        

        //how to use time event to make count down, from internet

        this.text = this.add.text(32, 32, 'CountDown', initialTime);
        this.timedEvent = this.time.addEvent({
        delay : 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop:true
        });

    }
        
    onEvent(){
        initialTime -= 1;
        this.text.setText('Countdown : ' + initialTime);
    }

    addScore(){

        let titleConfig = {
            fontFamily: 'Noteworthy',
            fontSize:'38px',
            backgroundColor:'#F3B141',
            color: '#843605',
            align: 'left',
            padding:{
            top: 0,
            bottom: 0,
            left: 30
        },
            fixedWidth: 200
        };
        
        this.score.destroy();
        totalScore += 10;
        this.score = this.add.text(100, 100, totalScore, titleConfig).setOrigin(0.5, 0.5);

    }

    collectStar(player,gold){
        gold.disableBody(true, true);
        gold.destroy();
        this.sound.play('ding');
        console.log('collect gold');

    }

    collectBooks(player, book){
        book.disableBody(true, true);
        this.sound.play('ding');
    }

    collectHearts(player, heart){
        heart.disableBody(true, true);
        this.sound.play('ding');
    }

    hittingGround(player, gold){
        this.sound.play('ding');
    }

    warp(){
        this.scene.start('homeScene');
        this.bgm.stop();
        this.sound.play('fall');
        this.main.x -= + (this.port.x);
    }

    checkGameOver(){
        if(this.main.y >= 1400){
            this.bgm.stop();
            this.sound.play('fall');
            this.scene.start('GameOver');
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
        this.load.image('wall', './assets/wall.png');
        this.load.image('book', './assets/book.png');
        this.load.image('heart', './assets/heart.png');
        this.load.image('longPlatform', './assets/longPlatform.png');
        this.load.image('shortPlatform', './assets/shortPlatform.png');
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

}