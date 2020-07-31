export class OverScene extends Phaser.Scene {

    private replay_button: Phaser.GameObjects.BitmapText;
    private board_button: Phaser.GameObjects.BitmapText;
    private share_button: Phaser.GameObjects.BitmapText;
    private score_text: Phaser.GameObjects.BitmapText;
    private rank_text: Phaser.GameObjects.BitmapText;
    
    private score: number;
    private rank: number = 100;
    private count: number = 1000;

    constructor() {
        super({ key: 'OverScene' })
    }

    init(data): void {
        this.score = data['score'];
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        this.add.image(320, 180, 'trophy');
        this.score_text = this.add.bitmapText(0, 360, 'gem', 'Score: ' + this.score, 36, 1);
        this.score_text.setX((640 - this.score_text.width) / 2);
        this.rank_text = this.add.bitmapText(0, 400, 'gem', 'Rank: ' + this.rank + '/' + this.count, 24, 1);
        this.rank_text.setX((640 - this.rank_text.width) / 2);

        this.replay_button = this.add.bitmapText(320, 560, 'gem', 'Replay', 48);

        this.replay_button.setX((640 - this.replay_button.width) / 2).setDisplayOrigin(0.5, 0.5)
        this.replay_button.setInteractive();
        this.replay_button.on('pointerup', () => {
            this.scene.start("GameScene");
        });

        this.board_button = this.add.bitmapText(320, 620, 'gem', 'Board', 48);
        this.board_button.setX((640 - this.board_button.width) / 2).setDisplayOrigin(0.5, 0.5)
        this.board_button.setInteractive();
        this.board_button.on('pointerup', () => {
        });

        this.share_button = this.add.bitmapText(320, 680, 'gem', 'Share', 48);
        this.share_button.setX((640 - this.share_button.width) / 2).setDisplayOrigin(0.5, 0.5)
        this.share_button.setInteractive();
        this.share_button.on('pointerup', () => {
        });
    }
}