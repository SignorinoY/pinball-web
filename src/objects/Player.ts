export class Player extends Phaser.Physics.Matter.Image {

    // public animation: Phaser.Tweens.Tween;
    // public player: Phaser.Physics.Matter.Image;
    public scene: Phaser.Scene;
    public disk: Phaser.GameObjects.Image;
    public arrow: Phaser.GameObjects.Image;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, scene: Phaser.Scene) {

        super(world, x, y, 'player');
        this.scene = scene;

        this.disk = scene.add.image(x, y, 'player-disk').setVisible(false);
        this.arrow = scene.add.image(x, y, 'player-arrow').setOrigin(0, 0.5).setVisible(false);
        // 物体形状
        this.setBody({ type: 'circle', radius: 48 }, { label: 'player' });
        // 摩擦系数
        this.setFriction(0.1);
        // 弹跳系数
        this.setBounce(1);
        // 播放动画
        // this.animation = this._scene.tweens.add({
        //     targets: this.player,
        //     duration: 800,
        //     repeat: -1,
        //     props: { scale: { value: 1.1, ease: 'Power3' } }
        // });
        // 可交互性
        this.setInteractive({ draggable: true });

        world.scene.add.existing(this)
        
    }

    onDragStart(): void {
        this.setVelocity(0);
        this.disk.setX(this.x)
        this.disk.setY(this.y)
        this.disk.setVisible(true);
        this.arrow.setX(this.x)
        this.arrow.setY(this.y)
        this.arrow.setVisible(true);
    }

    onDrag(position_x, position_y): void {
        const delta_x = position_x - this.x;
        const delta_y = position_y - this.y;
        const delta = Math.max(50, Math.min(150, Math.sqrt(delta_x * delta_x + delta_y * delta_y)));
        const angle = Math.atan2(delta_y, delta_x) / Math.PI * 180;
        this.arrow.displayWidth = delta;
        this.arrow.setAngle(angle);
    }

    onDragEnd(position_x, position_y): void {
        this.disk.setVisible(false);
        this.arrow.setVisible(false);
        const delta_x = position_x - this.x;
        const delta_y = position_y - this.y;
        const delta = Math.max(50, Math.min(150, Math.sqrt(delta_x * delta_x + delta_y * delta_y)));
        const speed_x = delta * Math.cos(Math.atan2(delta_y, delta_x)) / 10;
        const speed_y = delta * Math.sin(Math.atan2(delta_y, delta_x)) / 10;
        this.setVelocity(speed_x, speed_y);
    }
}