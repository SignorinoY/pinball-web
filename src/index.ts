import Phaser = require('phaser');

import { BootScene } from './scenes/BootScene'
import { MainScene } from './scenes/MainScene'
import { GameScene } from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    parent: 'app',
    scene: [BootScene, MainScene, GameScene],
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: false,
        }
    },
}

export default new Phaser.Game(config)