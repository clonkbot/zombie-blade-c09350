import { useEffect, useState } from 'react'

interface HUDProps {
  score: number
  round: number
  health: number
  zombiesKilled: number
}

export default function HUD({ score, round, health, zombiesKilled }: HUDProps) {
  const [prevHealth, setPrevHealth] = useState(health)
  const [showDamage, setShowDamage] = useState(false)

  useEffect(() => {
    if (health < prevHealth) {
      setShowDamage(true)
      setTimeout(() => setShowDamage(false), 300)
    }
    setPrevHealth(health)
  }, [health, prevHealth])

  const healthColor = health > 60 ? '#00ff41' : health > 30 ? '#ffaa00' : '#ff1744'
  const isLowHealth = health <= 30

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Damage flash */}
      {showDamage && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255, 0, 0, 0.4) 100%)',
            animation: 'pulse 0.3s ease-out'
          }}
        />
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex justify-between items-start">
        {/* Round indicator */}
        <div
          className="flex flex-col items-center p-2 md:p-3"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 23, 68, 0.2) 0%, transparent 100%)',
            borderLeft: '2px solid #ff1744'
          }}
        >
          <span
            className="text-xs tracking-widest"
            style={{ color: '#ff174499' }}
          >
            ROUND
          </span>
          <span
            className="text-3xl md:text-5xl font-bold glitch-text"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#ff1744',
              textShadow: '0 0 10px #ff1744, 0 0 20px #ff174480'
            }}
          >
            {round}
          </span>
        </div>

        {/* Score */}
        <div
          className="text-right p-2 md:p-3"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 255, 65, 0.2) 0%, transparent 100%)',
            borderRight: '2px solid #00ff41'
          }}
        >
          <span
            className="text-xs tracking-widest block"
            style={{ color: '#00ff4199' }}
          >
            SCORE
          </span>
          <span
            className="text-2xl md:text-4xl font-bold"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#00ff41',
              textShadow: '0 0 10px #00ff41, 0 0 20px #00ff4180'
            }}
          >
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-8 md:bottom-6 left-0 right-0 px-3 md:px-4">
        <div className="flex justify-between items-end gap-4">
          {/* Health bar */}
          <div className="flex-1 max-w-xs md:max-w-sm">
            <div className="flex justify-between mb-1">
              <span
                className="text-xs tracking-widest"
                style={{ color: healthColor + '99' }}
              >
                HEALTH
              </span>
              <span
                className={`text-xs ${isLowHealth ? 'health-critical' : ''}`}
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  color: healthColor
                }}
              >
                {health}%
              </span>
            </div>

            <div
              className="h-3 md:h-4 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: `1px solid ${healthColor}50`
              }}
            >
              {/* Health fill */}
              <div
                className={`h-full transition-all duration-300 ${isLowHealth ? 'health-critical' : ''}`}
                style={{
                  width: `${health}%`,
                  background: `linear-gradient(90deg, ${healthColor}80, ${healthColor})`,
                  boxShadow: `0 0 10px ${healthColor}80`
                }}
              />

              {/* Segmentation lines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 9%, rgba(0,0,0,0.5) 9%, rgba(0,0,0,0.5) 10%)'
                }}
              />
            </div>
          </div>

          {/* Kill counter */}
          <div
            className="text-center p-2"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid #ff174450'
            }}
          >
            <div
              className="text-lg md:text-2xl font-bold"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#ff1744'
              }}
            >
              {zombiesKilled}
            </div>
            <div
              className="text-[8px] md:text-[10px] tracking-widest"
              style={{ color: '#ff174480' }}
            >
              KILLS
            </div>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 pointer-events-none"
        style={{
          borderTop: '2px solid #ff174440',
          borderLeft: '2px solid #ff174440'
        }}
      />
      <div
        className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 pointer-events-none"
        style={{
          borderTop: '2px solid #00ff4140',
          borderRight: '2px solid #00ff4140'
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 pointer-events-none"
        style={{
          borderBottom: '2px solid #ff174420',
          borderLeft: '2px solid #ff174420'
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 pointer-events-none"
        style={{
          borderBottom: '2px solid #00ff4120',
          borderRight: '2px solid #00ff4120'
        }}
      />

      {/* Instructions - hidden on very small screens */}
      <div className="hidden md:block absolute left-1/2 bottom-20 -translate-x-1/2">
        <div
          className="text-[10px] tracking-wider opacity-50"
          style={{ color: '#ffffff' }}
        >
          BLADE AUTO-ROTATES • SURVIVE THE HORDE
        </div>
      </div>
    </div>
  )
}
