import * as request from 'superagent';

import cookie from 'cookiejs';

import Canvas from 'phaser3-rex-plugins/plugins/canvas.js';

import { convertAvatar2Base64 } from '../utils/image'

async function addUserInfo(scene, openid) {
    if (openid != false) {
        const result = await request
            .get('https://xwfintech.qingke.io/5ef21525813260002d508321/api/user/' + openid);
        const base64 = await convertAvatar2Base64(result.body.headimgurl);
        if (base64 != '') {
            scene.add.existing(
                new Canvas(this, 220, 520, 100, 100).loadFromURLPromise(base64)
            );
        }
    } else {
        scene.add.image(220, 520, 'avatar-default');
    }
}

export class ShareScene extends Phaser.Scene {

    private score: number;
    private rank = 100;
    private count = 1000;

    constructor() {
        super({ key: 'ShareScene' })
    }


    init(data: { [x: string]: number; }): void {
        this.score = data['score'];
        this.rank = data['rank'];
        this.count = data['count'];
    }

    create(): void {

        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        const openid = cookie.get('openid') as unknown;

        addUserInfo(this, openid);

        this.add.image(320, 240, 'title');

        this.add.bitmapText(300, 490, 'gem', 'Score: ' + this.score, 36, 1);
        this.add.bitmapText(300, 530, 'gem', 'Rank: ' + this.rank + '/' + this.count, 24, 1);

        this.add.image(320, 720, 'QR-Code');
        this.add.bitmapText(158, 840, 'gem', 'Press and hold the QR code,\n Let\'s challange together!', 24, 1);

        this.add.bitmapText(540, 900, 'gem', 'Back', 36)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start("OverScene");
            });
    }
}