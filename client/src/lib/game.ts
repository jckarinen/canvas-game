import Entity from "./entities/entity.ts";
import Camera from "./entities/camera.ts";
import Main from "./entities/main.ts";
// import GameUtils from "./game-utils.ts"

export default class Game {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    playing: boolean = true
    lastTime: number = 0
    entities: Set<Entity> = new Set()
    world: {w: number, h: number} = {w: 800, h: 600}
    activeCamera!: Camera
    main!: Main
    assets: string[] = [
        'fish-white',
        'fish-purple',
        'fish-pink',
        'fish-green',
        'fish-blue',
        'fish-yellow',
        'pellet',
    ]
    sprites: { [key: string]: HTMLImageElement } = {}
    keysPressed: { [key: string]: boolean } = {}
    keysJustPressed: { [key: string]: boolean } = {}
    keyController!: AbortController
    eventNameToCallback: Map<string, CallableFunction> = new Map()
    signals: Map<string, object> = new Map()
    timeElapsed!: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx: CanvasRenderingContext2D | null = this.canvas.getContext('2d')
        if (ctx === null) throw new Error('Unable to get canvas context')
        this.ctx = ctx
        this.ctx.imageSmoothingEnabled = true
        this.ctx.imageSmoothingQuality = 'high'
        this.ctx.fillStyle = 'midnightBlue'
    }

    start = (): void => {
        this.timeElapsed = 0

        this.playing = true
        this.setupKeyListeners()

        this.entities = new Set()

        this.main = new Main()
        this.addEntity(this.main)

        const camera = Camera._default(this)
        this.activeCamera = camera

        this.addEntity(camera)

        for (const ety of this.entities) {
            ety.onGameStart()
        }

        console.log('Game started')
        requestAnimationFrame(this.loop)
    }

    stop = (): void => {
        this.playing = false
        this.keyController.abort()
        console.log('Game stopped')
    }

    reset = (): void => {
        this.stop()
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.start()
            })
        })
    }

    loop = (currentTime: number): void => {
        if (!this.playing) return
        const delta: number = currentTime - this.lastTime
        this.timeElapsed += delta

        for (const entity of this.entities) {
            entity.processCollisions()
            entity.process(delta)
            entity.clearCollisions()
        }

        this.render()

        this.lastTime = currentTime
        requestAnimationFrame(this.loop)
    }

    render = (): void => {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        for (const ety of this.entities) {
            this.renderEntity(ety)
        }
    }

    renderEntity= (ety: Entity): void => {
        if (ety.sprite.name === null) return
        const widthRatio: number = this.canvas.width / this.world.w
        const heightRatio: number = this.canvas.height / this.world.h
        const screenX: number = (ety.pos.x - this.activeCamera.pos.x) * this.activeCamera.zoom * widthRatio + this.canvas.width / 2
        const screenY: number = (ety.pos.y - this.activeCamera.pos.y) * this.activeCamera.zoom * heightRatio + this.canvas.height / 2
        this.ctx.save()
        this.ctx.translate(screenX, screenY)
        this.ctx.rotate(ety.rotation)
        this.ctx.drawImage(this.sprites[ety.sprite.name],
            -ety.sprite.w / 2 * widthRatio * this.activeCamera.zoom,
            -ety.sprite.h / 2 * heightRatio * this.activeCamera.zoom,
            ety.sprite.w * widthRatio * this.activeCamera.zoom,
            ety.sprite.h * heightRatio * this.activeCamera.zoom)
        this.ctx.restore()
    }

    async loadAssets(): Promise<boolean> {
        try {
            await Promise.all(this.assets.map(assetName => this.loadImage(assetName)))
            return true
        }
        catch(error) {
            console.error('Failed to load assets', error)
            return false
        }
    }

    loadImage(assetName: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = () => reject(new Error(`Failed to load asset: ${assetName}`))
            img.src = `/assets/images/${assetName}.png`
            this.sprites[assetName] = img
        })
    }

    addEntity(ety: Entity): void {
        ety.game = this
        ety.onCreate()
        this.entities.add(ety)
    }

    removeEntity(ety: Entity): void {
        this.entities.delete(ety)
    }

    queryEntitiesByType(type: string): Entity[] {
        return [...this.entities].filter((ety) => ety.type === type)
    }

    setupKeyListeners(): void {
        this.keyController = new AbortController()
        window.addEventListener('keydown', (e) => {
            this.keysPressed[e.key] = true
            this.keysJustPressed[e.key] = true
            requestAnimationFrame(() => {
                this.keysJustPressed[e.key] = false
            })
        }, { signal: this.keyController.signal } )
        window.addEventListener('keyup', (e) => {
            requestAnimationFrame(() => {
                this.keysPressed[e.key] = false
                this.keysJustPressed[e.key] = false
            })
        }, { signal: this.keyController.signal } )
    }

    keyPressed(key: string): boolean {
        return this.keysPressed[key]
    }

    keyJustPressed(key: string): boolean {
        return this.keysJustPressed[key]
    }

    // UI connections

    on(name: string, callback: CallableFunction) {
        this.eventNameToCallback.set(name, callback)
    }

    emit(name: string, data: object = {}): void {
        const callback = this.eventNameToCallback.get(name)
        if (!callback) return
        callback(data)
    }

    signal(name: string, data: object = {}) {
        this.signals.set(name, data)
    }

    onSignalReceived(name: string, callback: CallableFunction): boolean {
        const data = this.signals.get(name)
        if (!data) return false
        callback(data)
        this.signals.delete(name)
        return true
    }
}
