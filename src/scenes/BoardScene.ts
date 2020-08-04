import { GridTable } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

const Random = Phaser.Math.Between;
var CreateItems = function (count) {
    var data = [];
    for (var i = 0; i < count; i++) {
        data.push({
            id: i,
            color: Random(0, 0xffffff)
        });
    }
    return data;
}

export class BoardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoardScene' })
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);
        var scrollMode = 0; // 0:vertical, 1:horizontal
        var table = new GridTable(this, {
            x: 400,
            y: 300,
            width: (scrollMode === 0) ? 300 : 420,
            height: (scrollMode === 0) ? 420 : 300,
            scrollMode: scrollMode,
            table: {
                cellWidth: (scrollMode === 0) ? undefined : 60,
                cellHeight: (scrollMode === 0) ? 60 : undefined,
                columns: 2,
                mask: {
                    padding: 2,
                },
                reuseCellContainer: true,
            },
            items: CreateItems(100)
        });
        this.add.existing(table);
    }

}