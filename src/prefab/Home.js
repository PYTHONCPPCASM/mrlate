class Home extends Phaser.Scene{
    constructor(){
        super('homeScene');
    }

    preload(){
        
        //make a sprite sheet call walk
        this.load.spritesheet('walk', './assets/kid.png',{
            frameWidth: 42,
            frameHeight: 78,
            startFrame: 0,
            endFrame: 2,
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
        let titleConfig = {
            fontFamily: 'Noteworthy',
            fontSize:'50px',
            backgroundColor:'#FFFFFF',
            color: '#000000',
            align: 'left',
            padding:{
            top: 0,
            bottom: 0,
            left: 130
        },
            fixedWidth: 773
        };


        //slice the walk and name it move
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('walk', {start: 0, end: 3, first: 0}),
            frameRate: 13,
            repeat: -1
        });

        this.main = this.physics.add.sprite(200, 400, 'walk');
        this.main.anims.play('move');
        this.add.text(300, 200, 'You have reached home', titleConfig);
        this.hint = this.add.text(300, 300, 'Press \'R\' to go back', titleConfig);
        this.back = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.back)){
            this.scene.start('playScene');
        }
    }

}