export class OverScene extends Phaser.Scene {

    constructor() {
        super({ key: 'OverScene' })
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);
        this.add.bitmapText(200, 440, 'gem', 'GAME\nOVER' , 128)
    }
}