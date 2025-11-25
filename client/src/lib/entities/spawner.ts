import Entity from './entity.ts'
import Pellet from './pellet.ts'
import GameUtils from '../game-utils.ts'

export default class Spawner extends Entity {
    process() {
        this.onSignalReceived('spawnPellet', () => {
            this._spawnPellet()
        })

        if (Math.random() > 0.99 && Pellet.count != Pellet.max) {
            this._spawnPellet()
        }
    }

    _spawnPellet(): void {
        if (Pellet.count >= Pellet.max) return
        const pellet = new Pellet()
        pellet.pos = GameUtils.randPointWithin(this.game.world)
        this.game.addEntity(pellet)
    }
}