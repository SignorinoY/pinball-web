import request = require('superagent');

import { GridTable, Sizer, Canvas } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

function ConvertAvatar2Base64(url) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.crossOrigin = 'annoymous';
        image.src = url;
        var canvas = document.createElement("canvas");
        canvas.height = 100;
        canvas.width = 100;
        var ctx = canvas.getContext("2d");
        image.onload = () => {
            ctx.drawImage(image, 0, 0, 100, 100);
            resolve(canvas.toDataURL("image/"));
            canvas = null;
        }
    });
}

const GetValue = Phaser.Utils.Objects.GetValue;

var CreateRowItem = function (scene, config) {
    var id = GetValue(config, 'id', undefined);
    if (id === undefined) {
        id = scene.add.bitmapText(0, 0, 'gem', id, 36);
    }
    var avatar = GetValue(config, 'avatar', undefined);
    if (avatar === undefined) {
        avatar = scene.add.existing(new Canvas(scene, 0, 0, 100, 100));
    }
    var nickname = GetValue(config, 'nickname', undefined);
    if (nickname === undefined) {
        nickname = scene.add.text(0, 0, nickname);
    }
    var score = GetValue(config, 'score', undefined);
    if (score === undefined) {
        score = scene.add.bitmapText(0, 0, 'gem', score, 36);
    }
    return scene.add.existing(
        new Sizer(scene, {
            width: GetValue(config, 'width', undefined),
            height: GetValue(config, 'height', undefined),
            orientation: 'x',
        })
            .add(id, 0, 'center', { left: 10 }, false, 'id')
            .addSpace()
            .add(avatar, 0, 'center', {}, false, 'avatar')
            .addSpace()
            .add(nickname, 0, 'center', {}, false, 'nickname')
            .addSpace()
            .add(score, 0, 'center', {}, false, 'score')
    );
}

async function getItems(count) {
    let data;
    data = await request
        .get('https://xwfintech.qingke.io/5ef21525813260002d508321/api/rank')
        .query({ limit: count });
    console.log(data)
    return data;
}

export class BoardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoardScene' })
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        this.add.bitmapText(176, 120, 'gem', 'Leader Board', 48)
        var scrollMode = 0; // 0:vertical, 1:horizontal
        var table = new GridTable(this, {
            x: 320,
            y: 480,
            width: 480,
            height: 640,

            scroolMode: 0,

            table: {
                cellWidth: undefined,
                cellHeight: 60,
                columns: 1,
                reuseCellContainer: true,
            },
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                table: 20,
                header: 10,
                fotter: 10,
            },
            createCellContainerCallback: function (cell, cellContainer) {
                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;
                if (cellContainer === null) {
                    var score = scene.add.bitmapText(0, 0, 'gem', '', 36);
                    cellContainer = CreateRowItem(scene, undefined);
                }
                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('id').setText(item.id);
                cellContainer.getElement('nickname').setText(item.nickname);
                cellContainer.getElement('score').setText(item.score);
                return cellContainer;
            },
            items: getItems()
        })
            .layout();
        this.add.existing(table);
    }

}