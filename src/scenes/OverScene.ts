import * as request from 'superagent';

async function addRank(scene, score) {
    const result = await request.get('https://xwfintech.qingke.io/5ef21525813260002d508321/api/rank/' + score);
    const rank = scene.add.bitmapText(0, 400, 'gem', 'Rank: ' + result.body.rank + '/' + result.body.count, 24, 1);
    rank.setX((640 - rank.width) / 2);
    scene.rank = result.body.rank;
    scene.count = result.body.count;
}

export class OverScene extends Phaser.Scene {

    private score: number;
    private rank: number;
    private count: number;

    constructor() {
        super({ key: 'OverScene' })
    }

    init(data: { [x: string]: number; }): void {
        this.score = data['score'];
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        this.add.image(320, 180, 'trophy');
        this.add.bitmapText(221, 360, 'gem', 'Score: ' + this.score.toString().padStart(4, '0'), 36, 1);
        addRank(this, this.score);

        this.add.bitmapText(248, 560, 'gem', 'Replay', 48)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start("GameScene");
            });
        this.add.bitmapText(260, 620, 'gem', 'Board', 48)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start("BoardScene");
            });
        this.add.bitmapText(260, 680, 'gem', 'Share', 48)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start("ShareScene", { score: this.score, rank: this.rank, count: this.count });
            });
    }
}