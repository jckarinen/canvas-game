import { createContext } from 'react'
import type Game from '../../lib/game.ts'

export const GameContext = createContext<Game | null>(null)