export class MainScene extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private logo: Phaser.GameObjects.Image;
    private title: Phaser.GameObjects.Image;
    private play_button: Phaser.GameObjects.Image;

    constructor() {
        super({ key: 'MainScene' })
    }

    create(): void {

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        this.logo = this.add.image(320, 120, 'logo');
        this.title = this.add.image(320, 400, 'title');

        this.play_button = this.add.image(320, 720, 'start-button').setInteractive();
        this.play_button.on('pointerup', () => {
            this.scene.start("GameScene");
        });
        this.tweens.add({ targets: this.play_button, repeat: -1, props: { scale: { value: 1.1, ease: 'Power3' } } });
    }
}