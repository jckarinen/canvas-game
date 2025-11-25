import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from "./App.tsx";
import GameCanvas from "./components/GameCanvas/GameCanvas.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GameCanvas></GameCanvas>
    </StrictMode>,
)
