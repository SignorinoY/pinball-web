import cookie from 'cookiejs';

import request = require('superagent');

import Canvas from 'phaser3-rex-plugins/plugins/canvas.js';

function ConvertAvatar2Base64(url, callback) {
    var image = new Image();
    image.crossOrigin = 'annoymous';
    image.src = url;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    image.onload = function () {
        canvas.height = 100;
        canvas.width = 100;
        ctx.drawImage(image, 0, 0, 100, 100);
        var dataURL = canvas.toDataURL("image/");
        callback.call(this, dataURL);
        canvas = null;
    };
}

export class ShareScene extends Phaser.Scene {

    private nickname: Phaser.GameObjects.Text;
    private avatar: Phaser.GameObjects.GameObject;

    private score_text: Phaser.GameObjects.BitmapText;
    private rank_text: Phaser.GameObjects.BitmapText;

    private score: number;
    private rank: number = 100;
    private count: number = 1000;

    constructor() {
        super({ key: 'ShareScene' })
    }


    init(data): void {
        this.score = data['score'];
        this.rank = data['rank'];
        this.count = data['count'];
    }

    create(): void {

        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        const openid = cookie.get('openid') as unknown;

        var scene = this;
        if (openid != false) {
            request
                .get('https://xwfintech.qingke.io/5ef21525813260002d508321/api/user/' + openid)
                .end((error, result) => {
                    var canvas = new Canvas(this, 220, 520, 100, 100);
                    ConvertAvatar2Base64(
                        result.body.headimgurl,
                        (base64) => {
                            canvas.loadFromURLPromise(base64)
                                .then(function () {
                                    canvas.generateTexture('avatar');
                                });
                        })
                    scene.avatar = scene.add.existing(canvas);
                });
        } else {
            this.avatar = this.add.image(220, 520, 'avatar-default');
        }


        this.add.image(320, 240, 'title');

        this.score_text = this.add.bitmapText(300, 490, 'gem', 'Score: ' + this.score, 36, 1);
        this.rank_text = this.add.bitmapText(300, 530, 'gem', 'Rank: ' + this.rank + '/' + this.count, 24, 1);

        this.add.image(320, 720, 'QR-Code');
        this.add.bitmapText(158, 840, 'gem', 'Press and hold the QR code,\n Let\'s challange together!', 24, 1);
    }
}