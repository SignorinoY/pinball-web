export class Enemy extends Phaser.Physics.Matter.Image {

    public reward: number;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, radius: number, reward: number) {

        super(world, x, y, 'batman');

        this.reward = reward;
        // 物体形状
        this.setBody({ type: 'circle', radius: radius }, { label: 'enemy' });
        // 摩擦系数
        this.setFriction(0.1);
        // 弹跳系数
        this.setBounce(0.9);

        world.scene.add.existing(this)
    }

    onCollide(): number {
        this.destroy(true);
        return this.reward;
    }
}
