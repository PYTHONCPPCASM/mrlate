class Menu extends Phaser.Scene{


    constructor(){
        super('menuScreen');
    }

    preload(){
        this.load.image('title', './assets/maintitle.png');
        this.load.image('start', './assets/start.png');
    }

    create(){
        
        this.add.image(540, 373, 'title').setOrigin(0.5, 0.5).setScale(3).setInteractive();
        this.main = this.add.image(540, 573, 'start').setScale(5.0).setInteractive().setOrigin(0.5, 0.5);
        
        this.main.once('pointerup', ()=> {
            console.log('lololololol');
            this.scene.start('playScene');
        }, this);
        
    }

}