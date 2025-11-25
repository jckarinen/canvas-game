import Entity from "./entity.ts";
import Player from "./player.ts";
import Spawner from './spawner.ts'

export default class Main extends Entity {

    onGameStart() {
        const player = new Player();
        player.pos.x = this.game.world.w / 2
        player.pos.y = this.game.world.h / 2
        this.game.addEntity(player)

        this.game.addEntity(new Spawner())

        this.connect('gameOver', this._gameOver)
    }
    process() {
        if (this.game.keyJustPressed('f')) {
            this.game.emit('action')
        }

        this.game.onSignalReceived('externalAction', () => {
            console.log('Game received action from component')
        })
    }

    _gameOver() {
        console.log('Game over :(')
        this.game.reset()
    }
}