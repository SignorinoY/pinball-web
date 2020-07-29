import cookie from 'cookiejs';

import request = require('superagent');
import wx = require('weixin-js-sdk');
import Phaser = require('phaser');

import { BootScene } from './scenes/BootScene'
import { MainScene } from './scenes/MainScene'
import { GameScene } from './scenes/GameScene'
import { OverScene } from './scenes/OverScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'app',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 640,
        height: 960
    },
    scene: [BootScene, MainScene, GameScene, OverScene],
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: false,
        }
    },
}

function getUser(url) {
    var pattern = new RegExp("[?&]user\=([^&]+)", "g");
    var matcher = pattern.exec(url);
    return matcher != null ? decodeURIComponent(matcher[1]) : null;
}

const user = JSON.parse(getUser(location));

if (user == null && cookie("openid") == "") {
    // 请求微信授权
    const host = "https://xwfintech.qingke.io/wxapi";
    const authorize = "/connect/oauth2/authorize";
    const redirect_uri = "https://xwfintech.qingke.io/5ef21525813260002d508321";
    const scope = "snsapi_userinfo";
    const authorize_uri = host + authorize + "?redirect_uri=" + redirect_uri + "&scope=" + scope;
    window.location.href = authorize_uri;
} else if (user != null) {
    // 微信授权成功
    // 将微信用户 openid 存入 cookie
    cookie.set("openid", user["openid"], 7);
    const game = new Phaser.Game(config);
} else {
    // 已进行授权
    const game = new Phaser.Game(config);
}

// 微信菜单页面定制化链接分享
request
    .post('https://xwfintech.qingke.io/openapi/wechat/signature')
    .send({ url: location.href })
    .end(function (error, result) {
        wx.config({
            debug: false,
            appId: result.body.jssdk.appid,
            timestamp: result.body.jssdk.timestamp,
            nonceStr: result.body.jssdk.noncestr,
            signature: result.body.jssdk.signature,
            jsApiList: result.body.jssdk.jsApiList
        });
        wx.ready(function () {
            wx.onMenuShareAppMessage({
                title: '新网银行金融科技挑战赛·Pinball BY SignorinoY',
                link: 'https://xwfintech.qingke.io/5ef21525813260002d508321/',
                imgUrl: 'https://xwfintech.qingke.io/5ef21525813260002d508321/assets/images/share.png'
            });
            wx.onMenuShareTimeline({
                title: '新网银行金融科技挑战赛·Pinball BY SignorinoY',
                link: 'https://xwfintech.qingke.io/5ef21525813260002d508321/',
                imgUrl: 'https://xwfintech.qingke.io/5ef21525813260002d508321/assets/images/share.png'
            });
        })
    });

