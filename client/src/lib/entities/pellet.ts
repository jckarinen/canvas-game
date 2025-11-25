import Entity from './entity.ts'

export default class Pellet extends Entity {
    static max = 50
    static count = 0
    type = 'Pellet'
    sprite = {name: 'pellet', w: 10, h: 10}
    dim = {w: this.sprite.w, h: this.sprite.h}
    canCollide = true

    onCreate() {
        Pellet.count++
        this.connect('eaten', this._eaten)
    }

    _eaten() {
        Pellet.count--
        this.destroy()
    }
}