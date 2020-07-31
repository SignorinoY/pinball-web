import cookie from 'cookiejs';

import request = require('superagent');

export class ShareScene extends Phaser.Scene {

    private player_text: Phaser.GameObjects.Text;
    private player_photo: Phaser.GameObjects.Image;
    private score_text: Phaser.GameObjects.BitmapText;
    private rank_text: Phaser.GameObjects.BitmapText;

    private score: number;
    private rank: number = 100;
    private count: number = 1000;

    private nickname: string;
    private headimgurl: string;

    constructor() {
        super({ key: 'ShareScene' })
    }

    init(data): void {
        this.score = data['score'];
        this.rank = data['rank'];
        this.count = data['count'];
    }

    create(): void {

        const openid = "ogIOb0RchliWDAylJW9FGLEwhlEI";

        if (openid != false) {
            request.get('https://xwfintech.qingke.io/5ef21525813260002d508321/api/user/' + openid)
                .end((error, result) => {
                    this.nickname = result.body.nickname;
                    this.headimgurl = result.body.headimgurl;
                });
        }

        this.nickname = this.nickname === undefined ? 'Unknown' : this.nickname;

        var avatar = new Image();
        avatar.src = this.headimgurl
        if (this.headimgurl != '') {
            this.load.image('player-photo', this.headimgurl);
        }

        const player_photo_texture = this.headimgurl == '' ? 'default' : 'player-photo';

        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(640, 960);

        this.add.image(320, 240, 'trophy');

        this.player_photo = this.add.image(320, 460, player_photo_texture);
        this.player_photo.displayHeight = 100;
        this.player_photo.displayWidth = 100;

        this.player_text = this.add.text(0, 520, this.nickname, { fontSize: '24px', fontStyle: 'bold' });
        this.player_text.setX((640 - this.player_text.width) / 2);

        this.score_text = this.add.bitmapText(0, 580, 'gem', 'Score: ' + this.score, 36, 1);
        this.score_text.setX((640 - this.score_text.width) / 2);
        this.rank_text = this.add.bitmapText(0, 620, 'gem', 'Rank: ' + this.rank + '/' + this.count, 24, 1);
        this.rank_text.setX((640 - this.rank_text.width) / 2);

        this.add.image(320, 780, 'QR-Code');

        var canvas = document.getElementsByTagName("canvas")[0];
        var png = canvas.toDataURL("image/png");
    }
}