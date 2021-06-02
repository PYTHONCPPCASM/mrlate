class prescene extends Phaser.Scene{

    constructor(){
        super('preScene');
    }

    preload(){
        this.load.image('1', './assets/1.png');
        this.load.image('2', './assets/2.png');
        this.load.image('3', './assets/3.png');
        this.load.image('4', './assets/4.png');
        this.load.image('5', './assets/5.png');
        this.load.image('6', './assets/6.png');
        this.load.image('7', './assets/7.png');
    }

    create(){
        console.log('prescene');
        this.i = 0;
        this.list = ['1', '2', '3', '4', '5', '6', '7'];
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.image(borderX / 2, borderY / 2, this.list[this.i]).setScale(0.5);
        this.add.text(100, 720, "press space to continue", hintConfig);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.SPACE)){
            console.log('press space');
            this.i++;
            this.add.image(borderX / 2, borderY / 2, this.list[this.i]).setScale(0.5);
            this.add.text(100, 720, "press space to continue", hintConfig);
            if(this.i == 7){
                this.scene.start('playScene');
            }
        }
    }

}