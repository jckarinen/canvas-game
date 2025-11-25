import Entity from './entity.ts'
import GameUtils from '../game-utils.ts'
import Game from '../game.ts'

export default class Fish extends Entity {
    type = 'Fish'
    canCollide = true
    onCreate() {
        const randSize = GameUtils.randIntBetween(10, 125)
        const spriteName = 'fish-' + GameUtils.randChoice(['purple', 'pink', 'green', 'blue', 'yellow'])
        this.dim = { w: randSize * 0.8, h: randSize / 3}
        this.pos = {
            x: Math.random() > 0.5 ? -this.dim.w / 2 : this.game.world.w + this.dim.w / 2,
            y: GameUtils.randIntBetween(0, this.game.world.h),
        }
        this.rotation = this.pos.x < 0 ? 0 : -Math.PI
        this.moveForce = GameUtils.randFloatBetween(0.05, 0.25)
        this.vel.max = { x: this.moveForce, y: this.moveForce}
        this.sprite = { name: spriteName, w: randSize, h: randSize }

        this.connect('eaten', this._eaten)
    }

    process(delta: number) {
        if (this.game.state === Game.STATE_PAUSED) return

        if (this.isOutOfWorldBounds()) {
            this.destroy()
        }
        this.applyForce(delta)
        this.applyPhysics(delta)
    }


    _eaten() {
        this.destroy()
    }
}