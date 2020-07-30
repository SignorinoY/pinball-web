export class OverScene extends Phaser.Scene {

    private restart_button: Phaser.GameObjects.Image;
    
    private score: number;

    constructor() {
        super({ key: 'OverScene' })
    }

    init(data): void {
        this.score = data['score'];
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);
        this.add.bitmapText(185, 240, 'gem', 'GAME\nOVER', 136);
        this.add.bitmapText(480, 10, 'gem', 'Score:' + this.score, 32)

        this.restart_button = this.add.image(320, 640, 'start-button').setInteractive();
        this.restart_button.on('pointerup', () => {
            this.scene.start("GameScene");
        });
        this.tweens.add({ targets: this.restart_button, repeat: -1, props: { scale: { value: 1.1, ease: 'Power3' } } });
    }
}