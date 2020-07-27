import { Player } from '../objects/player'
import { Obstacle } from '../objects/Obstacle';
import { Enemy } from '../objects/Enemy';

export class GameScene extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private score: Phaser.GameObjects.BitmapText;
    private player: Player;
    private obstacles: Array<Obstacle> = [];

    constructor() {
        super({ key: 'GameScene' })
    }

    create(): void {
        this.matter.world.setBounds(0, 50, 640, 910);

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);
        this.score = this.add.bitmapText(440, 10, 'gem', 'Score:100', 32)

        this.player = new Player(this.matter.world, 320, 100, this);

        [{ 'p1': [100, 300], 'p2': [500, 300] }].forEach(obstacle_config => {
            this.obstacles.push(new Obstacle(this.matter.world, obstacle_config['p1'], obstacle_config['p2']));
        });
    }

    update(): void {
    }
}