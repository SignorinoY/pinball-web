export class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' })
    }

    create(): void {

        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        this.add.image(320, 120, 'logo');
        this.add.image(320, 400, 'title');

        const button = this.add.image(320, 720, 'start-button')
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start("GameScene");
            });

        this.tweens.add({ targets: button, repeat: -1, props: { scale: { value: 1.1, ease: 'Power3' } } });
    }
}