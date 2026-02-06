import { useState } from 'react'

interface MainMenuProps {
  onStart: () => void
  highScores: { name: string; score: number; round: number }[]
}

export default function MainMenu({ onStart, highScores }: MainMenuProps) {
  const [showScores, setShowScores] = useState(false)

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      {/* Background effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(139, 0, 0, 0.3) 100%)'
        }}
      />

      {/* Animated border glow */}
      <div
        className="absolute inset-4 md:inset-8 border border-red-900/30"
        style={{
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />

      {showScores ? (
        /* High Scores Panel */
        <div className="relative z-10 text-center max-w-md w-full">
          <h2
            className="text-2xl md:text-3xl mb-6 md:mb-8 tracking-widest glitch-text"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#00ff41',
              textShadow: '0 0 10px #00ff41, 0 0 20px #00ff4180'
            }}
          >
            HIGH SCORES
          </h2>

          <div
            className="p-3 md:p-4 mb-6 md:mb-8"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid #00ff4140'
            }}
          >
            {highScores.length > 0 ? (
              <div className="space-y-2">
                {highScores.map((entry, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 px-2 md:px-3"
                    style={{
                      borderBottom: i < highScores.length - 1 ? '1px solid #00ff4120' : 'none'
                    }}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span
                        className="text-xs md:text-sm w-5 md:w-6"
                        style={{
                          color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#00ff4180'
                        }}
                      >
                        {i + 1}.
                      </span>
                      <span
                        className="text-sm md:text-base"
                        style={{
                          fontFamily: 'Share Tech Mono, monospace',
                          color: '#00ff41'
                        }}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <span
                        className="text-xs"
                        style={{ color: '#ff174480' }}
                      >
                        R{entry.round}
                      </span>
                      <span
                        className="text-sm md:text-base"
                        style={{
                          fontFamily: 'Orbitron, sans-serif',
                          color: '#ffffff'
                        }}
                      >
                        {entry.score.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="py-6 md:py-8 text-sm"
                style={{ color: '#00ff4150' }}
              >
                NO RECORDS YET
              </div>
            )}
          </div>

          <button
            className="arcade-btn green"
            onClick={() => setShowScores(false)}
          >
            BACK
          </button>
        </div>
      ) : (
        /* Main Menu */
        <div className="relative z-10 text-center">
          {/* Title */}
          <div className="mb-4 md:mb-6">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight glitch-text"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#ff1744',
                textShadow: '0 0 20px #ff1744, 0 0 40px #ff174480, 0 0 60px #ff174440'
              }}
            >
              ZOMBIE
            </h1>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#00ff41',
                textShadow: '0 0 20px #00ff41, 0 0 40px #00ff4180'
              }}
            >
              BLADE
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-xs md:text-sm tracking-widest mb-8 md:mb-12"
            style={{ color: '#ffffff50' }}
          >
            SURVIVE THE HORDE • EMBRACE THE BLADE
          </p>

          {/* Sword graphic */}
          <div className="mb-8 md:mb-12 flex justify-center">
            <div
              className="w-40 md:w-64 h-1"
              style={{
                background: 'linear-gradient(90deg, transparent, #ff1744, transparent)',
                boxShadow: '0 0 20px #ff174480'
              }}
            />
          </div>

          {/* Menu buttons */}
          <div className="flex flex-col gap-3 md:gap-4 items-center">
            <button
              className="arcade-btn"
              onClick={onStart}
            >
              START GAME
            </button>

            <button
              className="arcade-btn green"
              onClick={() => setShowScores(true)}
            >
              HIGH SCORES
            </button>
          </div>

          {/* Controls hint */}
          <div
            className="mt-8 md:mt-12 text-[10px] md:text-xs tracking-wider"
            style={{ color: '#ffffff30' }}
          >
            <div className="mb-1">YOUR BLADE ROTATES AUTOMATICALLY</div>
            <div>ZOMBIES APPROACH FROM ALL SIDES</div>
          </div>
        </div>
      )}
    </div>
  )
}
