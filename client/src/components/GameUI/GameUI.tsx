import './game-ui.css'
import { GameContext } from '../GameContext/GameContext.tsx'
import { useContext, useEffect, useState } from 'react'
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


    const handleTogglePause = () => {
        game?.signal('togglePauseGame')
    }

    const handleResetGame = () => {
        game?.signal('resetGame')
    }

    const handleToggleDebug = () => {
        game?.signal('toggleDebug')
    }

    return (
         <>
             <div className={'ui'}>
                 <button className={"ui-btn"}>Current size: {size}</button>
                 <button className={"ui-btn"} onClick={handleTogglePause}>Pause/unpause</button>
                 <button className={"ui-btn"} onClick={handleResetGame}>Reset</button>
                 <button className={"ui-btn"} onClick={handleToggleDebug}>Toggle hitboxes</button>
             </div>
         </>
     )
}


export default GameUI
