class Turning extends Phaser.Scene{
    constructor(){
        super('turningScene');
    }

    //this scene will preload nothing
    preload(){

    }
    //it will only display text
    create(){
        console.log('turning scene');
        this.add.text(borderX / 2, borderY / 2, 'moving to the next scene');
    }

}