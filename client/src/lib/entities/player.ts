import Entity from "./entity.ts";
import type Pellet from './pellet.ts'
import type Fish from './fish.ts'
import Game from '../game.ts'

export default class Player extends Entity {
    sprite = {name: 'fish-white', w: 16, h: 16}
    dim = {w: this.sprite.w, h: this.sprite.w / 3}
    moveForce = 0.1
    vel = {x: 0, y: 0, max: {x: 0.17, y: 0.17}}
    handling = 0.01
    friction = 0.005
    canCollide = true
    checkCollisions = true

    process(delta: number) {
        if (this.game.state === Game.STATE_PAUSED) return

        this.onCollideWith('Pellet', (pellet: Pellet) => {
            this.emitTo(pellet, 'eaten')
            this._onConsume(3)
        })

        this.onCollideWith('Fish', (fish: Fish) => {
            if (this.dim.w * 0.8 > fish.dim.w) {
                this._onConsume(4)
                this.emitTo(fish, 'eaten')
            }
            else (this._eaten())
        })

        if (this.game.keyPressed('d')) {
            this.rotation += this.handling * delta
        }
        if (this.game.keyPressed('a')) {
            this.rotation -= this.handling * delta
        }
        if (this.game.keyJustPressed(' ')) {
            this.applyForce(delta)
        }

        this.applyPhysics(delta)
        this.stayInBounds()
    }

    _onConsume(factor: number = 1) {
        const moveGrowthFactor = (1 + factor * 0.01)
        console.log(moveGrowthFactor)
        this.dim.w += factor
        this.dim.h += factor
        this.sprite.w += factor
        this.sprite.h += factor
        this.moveForce *= moveGrowthFactor
        this.vel.max = {x: this.vel.max.x * moveGrowthFactor, y: this.vel.max.y * moveGrowthFactor}
        this._signalSize()
    }

    _signalSize() {
        this.game.emit('playerSizeChanged', { size: this.dim.w })
    }

    _eaten() {
        this.emitTo(this.game.main, 'gameOver')
    }
}