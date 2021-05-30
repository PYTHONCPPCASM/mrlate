class ghostFire extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.x = x;
        this.y = y;
    }

    update(){
        this.y += 3;
        this.x += 1;
        if(this.x > 1280 || this.y > 800) this.reset();
    }

    reset(){
        this.y = 0;
        this.x = this.range(0, 1280);
    }

    range(a, b){
        return Phaser.Math.Between(a, b);
    }

}