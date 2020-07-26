export class Player {

    // public animation: Phaser.Tweens.Tween;
    private _scene: Phaser.Scene;
    public player: Phaser.Physics.Matter.Image;
    public disk: Phaser.GameObjects.Image;
    public arrow: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        this._scene = scene;
        this.player = this._scene.matter.add.image(x, y, 'player');
        this.disk = this._scene.add.image(x, y, 'player-disk').setVisible(false);
        this.arrow = this._scene.add.image(x, y, 'player-arrow').setOrigin(0, 0.5).setVisible(false);
        // 物体形状
        this.player.setBody({ type: 'circle', radius: 48 })
        // 摩擦系数
        this.player.setFriction(0.1);
        // 弹跳系数
        this.player.setBounce(1);

        this.player.setAngularVelocity(0);
        // 播放动画
        // this.animation = this._scene.tweens.add({
        //     targets: this.player,
        //     duration: 800,
        //     repeat: -1,
        //     props: { scale: { value: 1.1, ease: 'Power3' } }
        // });
        // 可交互性
        this.player.setInteractive({ draggable: true });
    }

    onDragStart(): void {
        this.player.setVelocity(0);
        this.disk.setX(this.player.x)
        this.disk.setY(this.player.y)
        this.disk.setVisible(true);
        this.arrow.setX(this.player.x)
        this.arrow.setY(this.player.y)
        this.arrow.setVisible(true);
    }

    onDrag(position_x, position_y): void {
        const delta_x = position_x - this.player.x;
        const delta_y = position_y - this.player.y;
        const delta = Math.max(50, Math.min(150, Math.sqrt(delta_x * delta_x + delta_y * delta_y)));
        const angle = Math.atan2(delta_y, delta_x) / Math.PI * 180;
        this.arrow.displayWidth = delta;
        this.arrow.setAngle(angle);
    }

    onDragEnd(position_x, position_y): void {
        this.disk.setVisible(false);
        this.arrow.setVisible(false);
        const delta_x = position_x - this.player.x;
        const delta_y = position_y - this.player.y;
        const delta = Math.max(50, Math.min(150, Math.sqrt(delta_x * delta_x + delta_y * delta_y)));
        const speed_x = delta * Math.cos(Math.atan2(delta_y, delta_x)) / 10;
        const speed_y = delta * Math.sin(Math.atan2(delta_y, delta_x)) / 10;
        this.player.setVelocity(speed_x, speed_y);
    }
}