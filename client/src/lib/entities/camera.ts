import Entity from "./entity.ts";
import type Game from "../game.ts";

export default class Camera extends Entity {
    zoom: number = 1
    zoomSpeed: number = 0.001

    constructor() {
        super()
    }

    static _default(game: Game): Camera {
        const camera = new Camera()
        camera.pos.x = game.world.w / 2
        camera.pos.y = game.world.h / 2
        camera.game = game
        return camera
    }



}