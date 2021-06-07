class System extends Phaser.Scene{
    constructor(){
        super('system');
    }

    preload(){

    }

    create(){
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
            fixedWidth: 600
        };

        
        this.keyPlay = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyHome = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

        this.add.text(100, 200, 'Press A to go to playScene', titleConfig);
        this.add.text(100, 300, 'Press B to go to homeScene', titleConfig);

    }

    update(){

        if(Phaser.Input.Keyboard.JustDown(this.keyPlay)){
            this.scene.start('playScene');
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyHome)){
            this.scene.start('homeScene');   
        }
    }

}