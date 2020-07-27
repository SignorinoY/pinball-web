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
            debug: true,
            gravity: false,
        }
    },
}

export default new Phaser.Game(config)