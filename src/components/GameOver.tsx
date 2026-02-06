import { useState } from 'react'

interface GameOverProps {
  score: number
  round: number
  zombiesKilled: number
  onRestart: () => void
  onMenu: () => void
  onSubmitScore: (name: string) => void
}

export default function GameOver({
  score,
  round,
  zombiesKilled,
  onRestart,
  onMenu,
  onSubmitScore
}: GameOverProps) {
  const [playerName, setPlayerName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (playerName.trim()) {
      onSubmitScore(playerName.trim().toUpperCase())
      setSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm px-4">
      {/* Blood drip effect */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(139, 0, 0, 0.6) 0%, transparent 100%)'
        }}
      />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Game Over Title */}
        <h1
          className="text-4xl md:text-6xl font-black tracking-wider mb-2 glitch-text"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            color: '#ff1744',
            textShadow: '0 0 20px #ff1744, 0 0 40px #ff174480'
          }}
        >
          GAME OVER
        </h1>

        <p
          className="text-xs md:text-sm tracking-widest mb-6 md:mb-8"
          style={{ color: '#ff174480' }}
        >
          THE HORDE WAS TOO STRONG
        </p>

        {/* Stats */}
        <div
          className="p-4 md:p-6 mb-6 md:mb-8"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid #ff174440'
          }}
        >
          {/* Score */}
          <div className="mb-4 md:mb-6">
            <div
              className="text-xs tracking-widest mb-1"
              style={{ color: '#00ff4180' }}
            >
              FINAL SCORE
            </div>
            <div
              className="text-3xl md:text-5xl font-bold"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#00ff41',
                textShadow: '0 0 10px #00ff41'
              }}
            >
              {score.toLocaleString()}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-6 md:gap-8">
            <div>
              <div
                className="text-xl md:text-2xl font-bold"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#ff1744'
                }}
              >
                {round}
              </div>
              <div
                className="text-[10px] md:text-xs tracking-widest"
                style={{ color: '#ff174480' }}
              >
                ROUNDS
              </div>
            </div>

            <div
              className="w-px"
              style={{ background: '#ffffff20' }}
            />

            <div>
              <div
                className="text-xl md:text-2xl font-bold"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#ff1744'
                }}
              >
                {zombiesKilled}
              </div>
              <div
                className="text-[10px] md:text-xs tracking-widest"
                style={{ color: '#ff174480' }}
              >
                KILLS
              </div>
            </div>
          </div>
        </div>

        {/* Name input for high score */}
        {!submitted ? (
          <div className="mb-6 md:mb-8">
            <div
              className="text-xs tracking-widest mb-3"
              style={{ color: '#00ff4180' }}
            >
              ENTER YOUR NAME FOR THE LEADERBOARD
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
              <input
                type="text"
                maxLength={8}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="NAME"
                className="arcade-input"
                autoFocus
              />
              <button
                className="arcade-btn green"
                onClick={handleSubmit}
                disabled={!playerName.trim()}
                style={{
                  opacity: playerName.trim() ? 1 : 0.5
                }}
              >
                SUBMIT
              </button>
            </div>
          </div>
        ) : (
          <div
            className="mb-6 md:mb-8 py-3 text-sm"
            style={{
              color: '#00ff41',
              animation: 'pulse 1s ease-in-out'
            }}
          >
            SCORE RECORDED!
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="arcade-btn"
            onClick={onRestart}
          >
            PLAY AGAIN
          </button>
          <button
            className="arcade-btn green"
            onClick={onMenu}
          >
            MAIN MENU
          </button>
        </div>
      </div>

      {/* Corner skull decorations */}
      <div
        className="absolute bottom-4 left-4 text-2xl md:text-4xl opacity-10"
        style={{ color: '#ff1744' }}
      >
        ☠
      </div>
      <div
        className="absolute bottom-4 right-4 text-2xl md:text-4xl opacity-10"
        style={{ color: '#ff1744' }}
      >
        ☠
      </div>
    </div>
  )
}
