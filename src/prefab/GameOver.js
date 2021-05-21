class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver');
    }

    create(){

        let titleConfig = {
            fontFamily: 'Noteworthy',
            fontSize:'50px',
            backgroundColor:'#000000',
            color: '#FFFFFF',
            align: 'left',
            padding:{
            top: 0,
            bottom: 0,
            left: 0
        },
            fixedWidth: 600
        };

        this.add.text(borderX / 2, borderY / 2 - 100, 'GameOver', titleConfig).setOrigin(0.5, 0.5);
        this.add.text(borderX / 2, borderY / 2, 'Press R to go back', titleConfig).setOrigin(0.5, 0.5);

        this.back = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.back)){
            this.scene.start('playScene');
        }
    }

}