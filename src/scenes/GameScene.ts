import { Player } from '../objects/player'
import { Obstacle } from '../objects/Obstacle';
import { Enemy } from '../objects/Enemy';

export class GameScene extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private score: Phaser.GameObjects.BitmapText;
    private player: Player;
    private obstacles: Array<Obstacle> = [];
    private enemies: Array<Enemy> = [];

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
        [{ 'x': 100, 'y': 100, 'radius': 50, 'reward': 100 }, { 'x': 100, 'y': 500, 'radius': 50, 'reward': 10 }].forEach(config => {
            this.enemies.push(new Enemy(this.matter.world, config['x'], config['y'], config['radius'], config['reward']));
        })

        this.player
            .on('dragstart', () => {
                this.chance -= 1;
                this.chance_text.text = 'Chance:' + this.chance;
                this.player.onDragStart();
            })
            .on('drag', (pointer) => {
                this.player.onDrag(pointer.x, pointer.y);
            })
            .on('dragend', (pointer) => {
                this.player.onDragEnd(pointer.x, pointer.y);
            });

        this.matter.world.on('collisionstart', function (event) {
            const pair = event.pairs[0];
            if (pair.bodyA.label === 'player' && pair.bodyB.label === 'enemy') {
                for (let i = 0; i < this.enemies.length; i++) {
                    const element = this.enemies[i];
                    if (element.body.id === pair.bodyB.id) {
                        this.score += element.onCollide();
                        this.score_text.text = 'Score:' + this.score;
                        this.enemies.splice(i, 1);
                        break;
                    }
                }
            }
        }, this);
    }

    update(): void {
    }
}