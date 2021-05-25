class Dialog extends Phaser.Scene{
    constructor(){
        super('dialogScene');
    }

    preload(){

    }

    create(){
        this.add.text(borderX / 2, borderY / 2, 'Still remember the time when \n you are a little kid?', titleConfig).setOrigin(0.5, 0.5);
        this.time.delayedCall(500, ()=>{ this.scene.start('playScene'); });
    }

}