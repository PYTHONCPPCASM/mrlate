class Home extends Phaser.Scene{
    constructor(){
        super('homeScene');
    }

    preload(){
    
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
        // this.anims.create({
        //     key: 'move',
        //     frames: this.anims.generateFrameNumbers('walk', {start: 0, end: 2, first: 0}),
        //     frameRate: 13,
        //     repeat: -1
        // });

        // this.main = this.physics.add.sprite(200, 400, 'walk');
        // this.main.anims.play('move');
        this.add.text(300, 200, 'You have reached home', titleConfig);
        this.hint = this.add.text(300, 300, 'Press \'R\' to go back', titleConfig);
        this.back = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.back)){
            this.scene.start('menuScreen');
        }
    }

}