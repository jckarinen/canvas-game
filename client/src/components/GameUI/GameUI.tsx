import './game-ui.css'
import { GameContext } from '../GameContext/GameContext.tsx'
import { type SyntheticEvent, useContext, useEffect, useState } from 'react'
function GameUI() {
    const game = useContext(GameContext)
    const [size, setSize] = useState<number | string>('Unknown!')

    const handlePlayerSizeChange = (data: { size: number }) => {
        setSize(() => data.size)
    }

    useEffect(() => {
        if (game === null) return
        game.on('playerSizeChanged', handlePlayerSizeChange)
    }, [game]);


    const handleSpawnPellet = (e: SyntheticEvent) => {
        console.log(e)
        game?.signal('spawnPellet')
    }

    const handleResetGame = () => {
        game?.signal('resetGame')
    }

     return (
         <>
             <div className={'ui'}>
                 <button className={"ui-btn"} onClick={handleSpawnPellet}>Spawn pellet</button>
                 <button className={"ui-btn"}>Current size: {size}</button>
                 <button className={"ui-btn"} onClick={handleResetGame}>Reset</button>
             </div>
         </>
     )
}


export default GameUI
