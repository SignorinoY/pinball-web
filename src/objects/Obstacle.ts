import { Vector } from 'matter';

export class Obstacle {

    private _scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, p1: Array<number>, p2: Array<number>) {
        this._scene = scene;
        const x = (p1[0] + p2[0]) / 2;
        const y = (p1[1] + p2[1]) / 2;
        const delta_x = p2[0] - p1[0];
        const delta_y = p2[1] - p1[1];
        const scale = Math.sqrt(delta_x * delta_x + delta_y * delta_y) / 675;
        const angle = Math.atan2(delta_y, delta_x) / Math.PI * 180;
        const obstacle = this._scene.matter.add.image(x, y, 'wall', undefined, { label: 'obstacle', isStatic: true, }).setScale(scale).setAngle(angle);
    }
}
