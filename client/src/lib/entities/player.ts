import Entity from "./entity.ts";
import type Pellet from './pellet.ts'

export default class Player extends Entity {
    sprite = {name: 'fish-white', w: 50, h: 50}
    dim = {w: this.sprite.w, h: this.sprite.w / 2}
    moveForce = 0.1
    vel = {x: 0, y: 0, max: {x: 0.30, y: 0.30}}
    handling = 0.01
    friction = 0.005
    canCollide = true
    checkCollisions = true

    process(delta: number) {
        this.onCollideWith('Pellet', (pellet: Pellet) => {
            this.emitTo(pellet, 'eaten')
            this._grow()
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
    }

    _grow() {
        this.dim.w += 1
        this.dim.h += 1
        this.sprite.w += 1
        this.sprite.h += 1
        this._signalSize()
    }

    _signalSize() {
        this.game.emit('playerSizeChanged', { size: this.dim.w })
    }
}