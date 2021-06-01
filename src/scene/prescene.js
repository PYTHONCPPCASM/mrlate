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

        var list = ['1', '2', '3', '4', '5', '6', '7'];
        let i = 0;
        this.add.image(borderX / 2, borderY / 2, list[i]).setScale(0.5);
        setInterval(()=>{
            i++;
            this.add.image(borderX / 2, borderY / 2, list[i]).setScale(0.5);
            if(i == 6){
                console.log('clear');
                this.scene.start('playScene');
            }
        }, 3000);

    }

}