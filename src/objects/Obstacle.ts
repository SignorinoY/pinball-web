export class Obstacle extends Phaser.Physics.Matter.Image {

    constructor(world: Phaser.Physics.Matter.World, p1: Array<number>, p2: Array<number>) {
        const x = (p1[0] + p2[0]) / 2;
        const y = (p1[1] + p2[1]) / 2;
        const delta_x = p2[0] - p1[0];
        const delta_y = p2[1] - p1[1];
        const scale = Math.sqrt(delta_x * delta_x + delta_y * delta_y) / 675;
        const angle = Math.atan2(delta_y, delta_x) / Math.PI * 180;

        super(world, x, y, 'wall');

        // 物体形状
        this.setBody({ type: 'rectangle'}, { label: 'obstacle', isStatic: true});
        // 物体位置
        this.setScale(scale).setAngle(angle);

        world.scene.add.existing(this)
    }
}
