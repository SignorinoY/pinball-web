import * as request from 'superagent';

import { GridTable, Sizer, Canvas } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

import { convertAvatar2Base64 } from '../utils/image'

const GetValue = Phaser.Utils.Objects.GetValue;

function createRowItem(scene: Phaser.Scene, config) {
    let id = GetValue(config, 'id', undefined);
    if (id === undefined) {
        id = scene.add.bitmapText(0, 0, 'gem', id, 36);
    }
    let avatar = GetValue(config, 'avatar', undefined);
    if (avatar === undefined) {
        avatar = scene.add.existing(new Canvas(scene, 0, 0, 50, 50));
    }
    let nickname = GetValue(config, 'nickname', undefined);
    if (nickname === undefined) {
        nickname = scene.add.text(0, 0, nickname, { font: '24px' });
    }
    let score = GetValue(config, 'score', undefined);
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
            .add(avatar, 0, 'center', { left: 50 }, false, 'avatar')
            .addSpace()
            .add(nickname, 0, 'center', {}, false, 'nickname')
            .addSpace()
            .add(score, 0, 'center', {}, false, 'score')
    );
}

async function addLeaderboard(scene, count) {
    const result = await request
        .get('https://xwfintech.qingke.io/5ef21525813260002d508321/api/rank')
        .query({ limit: count });
    const data = [];
    for (let i = 0; i < result.body.length; i++) {
        const item = result.body[i];
        data.push(
            {
                nickname: item.nickname,
                avatar: await convertAvatar2Base64(item.headimgurl, 50, 50),
                score: item.score
            }
        );
    }
    scene.add.bitmapText(176, 120, 'gem', 'Leader Board', 48)
    scene.add.existing(
        new GridTable(scene, {
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
                bottom: 20
            },
            createCellContainerCallback: function (cell, cellContainer) {
                const scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;
                if (cellContainer === null) {
                    cellContainer = createRowItem(scene, undefined);
                }
                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('id').setText(index + 1);
                cellContainer.getElement('avatar').loadFromURLPromise(item.avatar);
                cellContainer.getElement('nickname').setText(item.nickname);
                cellContainer.getElement('score').setText(item.score);
                return cellContainer;
            },
            items: data
        })
            .layout()
    );
}

export class BoardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BoardScene' })
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);
        addLeaderboard(this, 10);
        this.add.bitmapText(540, 900, 'gem', 'Back', 36)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start("OverScene");
            });
    }

}