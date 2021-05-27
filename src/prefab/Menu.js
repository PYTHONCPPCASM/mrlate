class Menu extends Phaser.Scene{


    constructor(){
        super('menuScreen');
    }

    preload(){
        this.load.image('title', './assets/maintitle.png');
        this.load.image('start', './assets/start.png');
        this.load.image('credit', './assets/credit.png');
    }

    create(){
        
        this.add.image(borderX / 2, borderY / 2 - 200, 'title').setOrigin(0.5, 0.5).setScale(3).setInteractive();
        this.main = this.add.image(borderX / 2, borderY / 2, 'start').setScale(5.0).setInteractive().setOrigin(0.5, 0.5);
        this.credit = this.add.image(borderX / 2, borderY / 2 + 100, 'credit').setScale(3).setInteractive().setOrigin(0.5, 0.5);
        
        this.main.once('pointerup', ()=> {
            this.scene.start('playScene3');
        }, this);

        this.creditText;

        this.credit.once('pointerup', ()=> {
            this.creditText = this.add.text(borderX / 2, borderY / 2 + 300, 'gameDevelopment : Chuanyu Xiao\n' + 
            'art: chuanyu xiao, can huang\n' +
            'Production Management : Minghui Ye\n', titleConfig).setOrigin(0.5, 0.5);
            
            this.time.delayedCall(10000, ()=>{
                    this.creditText.destroy();
                }
            );
        });
    }
}