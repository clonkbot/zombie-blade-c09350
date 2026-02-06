import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback, useEffect } from 'react'
import Game from './components/Game'
import HUD from './components/HUD'
import MainMenu from './components/MainMenu'
import GameOver from './components/GameOver'
import './styles.css'

export type GameState = 'menu' | 'playing' | 'gameover'

// Simple localStorage high score system
const getHighScores = (): { name: string; score: number; round: number }[] => {
  try {
    const saved = localStorage.getItem('zombieBlade_highScores')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveHighScore = (name: string, score: number, round: number) => {
  const scores = getHighScores()
  scores.push({ name, score, round })
  scores.sort((a, b) => b.score - a.score)
  const top10 = scores.slice(0, 10)
  localStorage.setItem('zombieBlade_highScores', JSON.stringify(top10))
  return top10
}

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [health, setHealth] = useState(100)
  const [zombiesKilled, setZombiesKilled] = useState(0)
  const [highScores, setHighScores] = useState(getHighScores())

  const startGame = useCallback(() => {
    setScore(0)
    setRound(1)
    setHealth(100)
    setZombiesKilled(0)
    setGameState('playing')
  }, [])

  const endGame = useCallback(() => {
    setGameState('gameover')
  }, [])

  const submitScore = useCallback((name: string) => {
    const newScores = saveHighScore(name, score, round)
    setHighScores(newScores)
  }, [score, round])

  const goToMenu = useCallback(() => {
    setHighScores(getHighScores())
    setGameState('menu')
  }, [])

  // Health check
  useEffect(() => {
    if (health <= 0 && gameState === 'playing') {
      endGame()
    }
  }, [health, gameState, endGame])

  return (
    <div className="game-container">
      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 12, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Game
            gameState={gameState}
            score={score}
            setScore={setScore}
            round={round}
            setRound={setRound}
            health={health}
            setHealth={setHealth}
            zombiesKilled={zombiesKilled}
            setZombiesKilled={setZombiesKilled}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {gameState === 'menu' && (
        <MainMenu onStart={startGame} highScores={highScores} />
      )}

      {gameState === 'playing' && (
        <HUD
          score={score}
          round={round}
          health={health}
          zombiesKilled={zombiesKilled}
        />
      )}

      {gameState === 'gameover' && (
        <GameOver
          score={score}
          round={round}
          zombiesKilled={zombiesKilled}
          onRestart={startGame}
          onMenu={goToMenu}
          onSubmitScore={submitScore}
        />
      )}

      {/* Footer */}
      <footer className="game-footer">
        Requested by <span className="footer-highlight">@plantingtoearn</span> · Built by <span className="footer-highlight">@clonkbot</span>
      </footer>
    </div>
  )
}

export default App
