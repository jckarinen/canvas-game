import { useEffect, useRef, useState } from 'react'
import Game from '../../lib/game'
import GameUI from '../GameUI/GameUI.tsx';
import { GameContext } from '../GameContext/GameContext.tsx'

function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [game, setGame] = useState<Game | null>(null)


    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current
        if (canvas === null) throw new Error('Canvas not found')
        const game = new Game(canvas)
        const assetsLoaded = async () => await game.loadAssets()
        if (!assetsLoaded()) throw new Error('Unable to load game assets')

        game.start()
        setGame(game)
        return () => game.stop()
    }, [])
    return (
        <>
            <GameContext.Provider value={game}>
                <GameUI />
                <canvas ref={canvasRef} id="myCanvas" width="800" height="600"></canvas>
            </GameContext.Provider>
        </>
    )
}

export default GameCanvas