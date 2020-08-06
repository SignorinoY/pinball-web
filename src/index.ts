import * as request from 'superagent';
import * as Phaser from 'phaser';

import cookie from 'cookiejs';
import wx from 'weixin-jsapi';

import sha1 = require('crypto-js/sha1');

import { BootScene } from './scenes/BootScene'
import { MainScene } from './scenes/MainScene'
import { GameScene } from './scenes/GameScene'
import { OverScene } from './scenes/OverScene';
import { BoardScene } from './scenes/BoardScene';
import { ShareScene } from './scenes/ShareScene';

function getUser(url) {
    const pattern = new RegExp("[?&]user=([^&]+)", "g");
    const matcher = pattern.exec(url);
    const user =  matcher != null ? decodeURIComponent(matcher[1]) : null;
    return JSON.parse(user);
}

if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {

    const user = getUser(location);

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
        // 将微信用户数据存入数据库
        request.post('https://xwfintech.qingke.io/5ef21525813260002d508321/api/user').send(user);
    }

    // 微信菜单页面定制化链接分享
    request
        .get('https://xwfintech.qingke.io/wxapi/cgi-bin/token')
        .then((result) => {
            const appId = 'wx0703b2844c4a2143';
            const jsapi_ticket = result.body['ticket'];
            const timestamp = Math.round(new Date().getTime() / 1000);
            const nonceStr = Math.random().toString(36).substr(2, 15);
            const url = location.href.split('#')[0];
            const string1 = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url;
            const signature = sha1(string1).toString();
            wx.config({
                debug: false,
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ']
            });
            wx.ready(() => {
                const share_title = '新网银行金融科技挑战赛·Pinball By SignorinoY';
                const share_desc = '朱望仔大战大反派，快来打榜挑战吧~😀';
                const share_link = 'https://xwfintech.qingke.io/5ef21525813260002d508321/';
                const share_banner = 'https://xwfintech.qingke.io/5ef21525813260002d508321/assets/images/share.png';
                wx.onMenuShareTimeline({
                    title: share_title,
                    link: share_link,
                    imgUrl: share_banner,
                    success: () => { return; },
                    cancel: () => { return; }
                });
                wx.onMenuShareAppMessage({
                    title: share_title,
                    desc: share_desc,
                    link: share_link,
                    imgUrl: share_banner,
                    type: '',
                    dataUrl: '',
                    success: () => { return; },
                    cancel: () => { return; }
                });
                wx.onMenuShareQQ({
                    title: share_title,
                    desc: share_desc,
                    link: share_link,
                    imgUrl: share_banner,
                    type: '',
                    dataUrl: '',
                    success: () => { return; },
                    cancel: () => { return; }
                });
            });
        });
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'app',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 640,
        height: 960
    },
    scene: [BootScene, MainScene, GameScene, OverScene, BoardScene, ShareScene],
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: false,
        }
    },
}

new Phaser.Game(config);
