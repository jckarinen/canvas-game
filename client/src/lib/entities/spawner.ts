import Entity from './entity.ts'
import Pellet from './pellet.ts'
import GameUtils from '../game-utils.ts'
import Fish from './fish.ts'

export default class Spawner extends Entity {
    totalSpawns: { [key: string]: number } = { fish: 0}
    process() {
        this.onSignalReceived('spawnPellet', () => {
            this._spawnPellet()
        })

        if (Math.random() > 0.99 && Pellet.count != Pellet.max) {
            this._spawnPellet()
        }

        if (Math.random() > 0.98) {
            this._spawnFish()
        }
    }

    _spawnPellet(): void {
        if (Pellet.count >= Pellet.max) return
        const pellet = new Pellet()
        pellet.pos = GameUtils.randPointWithin(this.game.world)
        this.game.addEntity(pellet)
    }

    _spawnFish(): void {
        this.game.addEntity(new Fish())
        this.totalSpawns.fish++
        // console.log(`Fish spawns per second: ${this.totalSpawns.fish / this.game.timeElapsed}`)
    }
}