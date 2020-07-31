import cookie from 'cookiejs';

import request = require('superagent');

import { Player } from '../objects/player'
import { Obstacle } from '../objects/Obstacle';
import { Enemy } from '../objects/Enemy';

export class GameScene extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private score_text: Phaser.GameObjects.BitmapText;
    private chance_text: Phaser.GameObjects.BitmapText;
    private player: Player;
    private obstacles: Array<Obstacle> = [];
    private enemies: Array<Enemy> = [];

    private score: number;
    private chance: number;

    constructor() {
        super({ key: 'GameScene' })
    }

    create(): void {
        this.matter.world.setBounds(0, 50, 640, 910);

        this.score = 0;
        this.chance = 5;

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);
        this.score_text = this.add.bitmapText(480, 10, 'gem', 'Score:' + this.score, 32)
        this.chance_text = this.add.bitmapText(320, 10, 'gem', 'Chance:' + this.chance, 32)

        this.player = new Player(this.matter.world, 320, 100, this);

        [{ 'p1': [100, 300], 'p2': [500, 300] }].forEach(obstacle_config => {
            this.obstacles.push(new Obstacle(this.matter.world, obstacle_config['p1'], obstacle_config['p2']));
        });
        [{ 'x': 100, 'y': 100, 'radius': 50, 'reward': 10 }, { 'x': 100, 'y': 500, 'radius': 50, 'reward': 10 }, { 'x': 500, 'y': 500, 'radius': 50, 'reward': 10 }, { 'x': 400, 'y': 300, 'radius': 50, 'reward': 10 }].forEach(config => {
            this.enemies.push(new Enemy(this.matter.world, config['x'], config['y'], config['radius'], config['reward']));
        })

        this.player
            .on('dragstart', () => {
                this.player.onDragStart();
            })
            .on('drag', (pointer) => {
                this.player.onDrag(pointer.x, pointer.y);
            })
            .on('dragend', (pointer) => {
                this.chance_text.text = 'Chance:' + --this.chance;
                this.player.onDragEnd(pointer.x, pointer.y);
            });

        this.matter.world.on('collisionstart', function (event) {
            const pair = event.pairs[0];
            if (pair.bodyA.label == 'player' && pair.bodyB.label == 'enemy') {
                for (let i = 0; i < this.enemies.length; i++) {
                    const element = this.enemies[i];
                    if (element.body.id == pair.bodyB.id) {
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
        const speed = Math.sqrt(Math.pow(this.player.body.velocity.x, 2) + Math.pow(this.player.body.velocity.y, 2));
        if ((this.enemies.length == 0 || this.chance == 0) && speed <= 0.5) {
            const openid = cookie.get('openid') as unknown;
            request
                .post('https://xwfintech.qingke.io/5ef21525813260002d508321/api/score')
                .send({ 'openid': openid != false ? openid : 'Unknown', 'score': this.score })
                .end();
            this.scene.start("OverScene", { score: this.score });
        }
    }
}