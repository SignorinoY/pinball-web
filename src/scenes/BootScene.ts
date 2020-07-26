export class BootScene extends Phaser.Scene {

    private loading_bar: Phaser.GameObjects.Graphics;
    private progress_bar: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'BootScene' })
    }

    preload(): void {
        // set the background and create loading bar
        this.cameras.main.setBackgroundColor(0x98d687);
        this.createLoading_bar();

        // pass value to change the loading bar fill
        this.load.on(
            "progress",
            function (value) {
                this.progress_bar.clear();
                this.progress_bar.fillStyle(0xfff6d3, 1);
                this.progress_bar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );

        // delete bar graphics, when loading complete
        this.load.on(
            "complete",
            function () {
                this.progress_bar.destroy();
                this.loading_bar.destroy();
            },
            this
        );

        // load out package
        this.load.pack(
            "preload",
            "./assets/pack.json",
            "preload"
        );
    }

    update(): void {
        this.scene.start("MainScene");
    }

    private createLoading_bar(): void {
        this.loading_bar = this.add.graphics();
        this.loading_bar.fillStyle(0x5dae47, 1);
        this.loading_bar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progress_bar = this.add.graphics();
    }
}