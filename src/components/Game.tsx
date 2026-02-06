import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { GameState } from '../App'

interface Zombie {
  id: number
  position: THREE.Vector3
  speed: number
  health: number
  ref?: THREE.Mesh
}

interface GameProps {
  gameState: GameState
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  round: number
  setRound: React.Dispatch<React.SetStateAction<number>>
  health: number
  setHealth: React.Dispatch<React.SetStateAction<number>>
  zombiesKilled: number
  setZombiesKilled: React.Dispatch<React.SetStateAction<number>>
}

// Player component with rotating sword
function Player({ bladeRef, position }: { bladeRef: React.MutableRefObject<THREE.Group | null>; position: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.y += 0.15
    }
    // Subtle bob
    if (groupRef.current) {
      groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Player body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#2a2a4a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Player head */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#3a3a5a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rotating blade assembly */}
      <group ref={bladeRef} position={[0, 0.8, 0]}>
        {/* Blade 1 */}
        <mesh castShadow position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 1.8, 0.05]} />
          <meshStandardMaterial
            color="#ff1744"
            emissive="#ff1744"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* Blade 2 */}
        <mesh castShadow position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 1.8, 0.05]} />
          <meshStandardMaterial
            color="#ff1744"
            emissive="#ff1744"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* Blade 3 */}
        <mesh castShadow position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.05, 1.8, 0.1]} />
          <meshStandardMaterial
            color="#ff1744"
            emissive="#ff1744"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* Blade 4 */}
        <mesh castShadow position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.05, 1.8, 0.1]} />
          <meshStandardMaterial
            color="#ff1744"
            emissive="#ff1744"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* Center hub */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Glow effect */}
      <pointLight color="#ff1744" intensity={2} distance={3} />
    </group>
  )
}

// Zombie component
function ZombieMesh({
  zombie,
  playerPos,
  onHit
}: {
  zombie: Zombie
  playerPos: THREE.Vector3
  onHit: (id: number) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHit, setIsHit] = useState(false)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Move toward player
    const direction = new THREE.Vector3()
      .subVectors(playerPos, meshRef.current.position)
      .normalize()

    meshRef.current.position.add(direction.multiplyScalar(zombie.speed * delta))

    // Face player
    meshRef.current.lookAt(playerPos)

    // Update zombie position reference
    zombie.position.copy(meshRef.current.position)
  })

  useEffect(() => {
    if (isHit) {
      const timer = setTimeout(() => setIsHit(false), 100)
      return () => clearTimeout(timer)
    }
  }, [isHit])

  return (
    <group position={zombie.position}>
      <mesh
        ref={meshRef}
        castShadow
        onClick={() => onHit(zombie.id)}
      >
        {/* Zombie body */}
        <group>
          {/* Torso */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.5, 0.8, 0.3]} />
            <meshStandardMaterial
              color={isHit ? '#ff0000' : '#2d4a2d'}
              emissive={isHit ? '#ff0000' : '#000000'}
              emissiveIntensity={isHit ? 0.5 : 0}
            />
          </mesh>

          {/* Head */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color={isHit ? '#ff0000' : '#3d5a3d'} />
          </mesh>

          {/* Eyes */}
          <mesh position={[0.08, 1.25, 0.2]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#00ff41" emissive="#00ff41" emissiveIntensity={1} />
          </mesh>
          <mesh position={[-0.08, 1.25, 0.2]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#00ff41" emissive="#00ff41" emissiveIntensity={1} />
          </mesh>

          {/* Arms */}
          <mesh position={[0.4, 0.5, 0.2]} rotation={[0.5, 0, 0.3]}>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial color={isHit ? '#ff0000' : '#2d4a2d'} />
          </mesh>
          <mesh position={[-0.4, 0.5, 0.2]} rotation={[0.5, 0, -0.3]}>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial color={isHit ? '#ff0000' : '#2d4a2d'} />
          </mesh>

          {/* Legs */}
          <mesh position={[0.15, 0, 0]}>
            <boxGeometry args={[0.15, 0.4, 0.15]} />
            <meshStandardMaterial color={isHit ? '#880000' : '#1d3a1d'} />
          </mesh>
          <mesh position={[-0.15, 0, 0]}>
            <boxGeometry args={[0.15, 0.4, 0.15]} />
            <meshStandardMaterial color={isHit ? '#880000' : '#1d3a1d'} />
          </mesh>
        </group>
      </mesh>
    </group>
  )
}

// Arena floor
function Arena() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[30, 30, '#ff174433', '#ff174411']} position={[0, 0.01, 0]} />

      {/* Arena boundary glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[14.5, 15, 64]} />
        <meshBasicMaterial color="#ff1744" transparent opacity={0.5} />
      </mesh>

      {/* Ambient light rings */}
      {[12, 9, 6].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
          <meshBasicMaterial color="#00ff41" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// Particle burst on zombie death
function DeathParticles({ position }: { position: THREE.Vector3 }) {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 10; i++) {
      temp.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          Math.random() * 3,
          (Math.random() - 0.5) * 5
        )
      })
    }
    return temp
  }, [position])

  const meshRefs = useRef<THREE.Mesh[]>([])
  const [visible, setVisible] = useState(true)

  useFrame((_, delta) => {
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.add(particles[i].velocity.clone().multiplyScalar(delta))
        particles[i].velocity.y -= 10 * delta
        mesh.scale.multiplyScalar(0.95)
      }
    })
  })

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <group>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el }}
          position={p.position}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#00ff41" />
        </mesh>
      ))}
    </group>
  )
}

export default function Game({
  gameState,
  score,
  setScore,
  round,
  setRound,
  health,
  setHealth,
  setZombiesKilled
}: GameProps) {
  const [zombies, setZombies] = useState<Zombie[]>([])
  const [deathEffects, setDeathEffects] = useState<{ id: number; position: THREE.Vector3 }[]>([])
  const [zombiesInRound, setZombiesInRound] = useState(0)
  const [zombiesSpawned, setZombiesSpawned] = useState(0)
  const playerPos = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const bladeRef = useRef<THREE.Group>(null)
  const nextZombieId = useRef(0)
  const lastSpawnTime = useRef(0)
  const { camera } = useThree()

  // Calculate round parameters
  const getRoundParams = useCallback((r: number) => ({
    zombieCount: 3 + r * 2,
    zombieSpeed: 1.5 + r * 0.3,
    zombieHealth: 1 + Math.floor(r / 3),
    spawnInterval: Math.max(0.5, 2 - r * 0.1)
  }), [])

  // Start new round
  const startRound = useCallback((r: number) => {
    const params = getRoundParams(r)
    setZombiesInRound(params.zombieCount)
    setZombiesSpawned(0)
    setZombies([])
  }, [getRoundParams])

  // Initialize game
  useEffect(() => {
    if (gameState === 'playing') {
      startRound(round)
      // Set initial camera position
      camera.position.set(0, 12, 12)
      camera.lookAt(0, 0, 0)
    }
  }, [gameState, round, startRound, camera])

  // Spawn zombies over time
  useFrame((state) => {
    if (gameState !== 'playing') return

    const params = getRoundParams(round)
    const now = state.clock.elapsedTime

    // Spawn new zombies
    if (zombiesSpawned < zombiesInRound && now - lastSpawnTime.current > params.spawnInterval) {
      lastSpawnTime.current = now

      // Random spawn position at edge of arena
      const angle = Math.random() * Math.PI * 2
      const distance = 13 + Math.random() * 2
      const spawnPos = new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      )

      const newZombie: Zombie = {
        id: nextZombieId.current++,
        position: spawnPos,
        speed: params.zombieSpeed * (0.8 + Math.random() * 0.4),
        health: params.zombieHealth
      }

      setZombies(prev => [...prev, newZombie])
      setZombiesSpawned(prev => prev + 1)
    }

    // Check blade collisions
    if (bladeRef.current) {
      const bladeRadius = 1.8

      setZombies(prevZombies => {
        const remaining: Zombie[] = []
        const killed: Zombie[] = []

        prevZombies.forEach(zombie => {
          const dist = zombie.position.distanceTo(playerPos)

          // Check if zombie hit by blade
          if (dist < bladeRadius + 0.5) {
            zombie.health--
            if (zombie.health <= 0) {
              killed.push(zombie)
            } else {
              // Push back
              const pushDir = new THREE.Vector3()
                .subVectors(zombie.position, playerPos)
                .normalize()
                .multiplyScalar(2)
              zombie.position.add(pushDir)
              remaining.push(zombie)
            }
          } else if (dist < 0.8) {
            // Zombie reached player
            setHealth(prev => prev - 10)
            killed.push(zombie)
          } else {
            remaining.push(zombie)
          }
        })

        if (killed.length > 0) {
          setScore(prev => prev + killed.length * 100 * round)
          setZombiesKilled(prev => prev + killed.length)
          setDeathEffects(prev => [
            ...prev,
            ...killed.map(z => ({ id: z.id, position: z.position.clone() }))
          ])

          // Clean up death effects after a delay
          setTimeout(() => {
            setDeathEffects(prev => prev.filter(e => !killed.find(k => k.id === e.id)))
          }, 600)
        }

        return remaining
      })
    }

    // Check if round is complete
    if (zombiesSpawned >= zombiesInRound && zombies.length === 0) {
      // Small delay before next round
      setTimeout(() => {
        setRound(prev => prev + 1)
        startRound(round + 1)
      }, 1500)
    }
  })

  const handleZombieHit = useCallback(() => {
    // Clicking zombies doesn't do direct damage in this version
    // The blade handles all damage
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, 0]} color="#ff1744" intensity={0.5} />

      {/* Environment */}
      <Environment preset="night" />
      <fog attach="fog" args={['#0a0a0a', 10, 30]} />

      {/* Arena */}
      <Arena />

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={30}
        blur={2}
        far={10}
        color="#000000"
      />

      {/* Player */}
      <Player bladeRef={bladeRef} position={playerPos} />

      {/* Zombies */}
      {gameState === 'playing' && zombies.map(zombie => (
        <ZombieMesh
          key={zombie.id}
          zombie={zombie}
          playerPos={playerPos}
          onHit={handleZombieHit}
        />
      ))}

      {/* Death effects */}
      {deathEffects.map(effect => (
        <DeathParticles key={effect.id} position={effect.position} />
      ))}
    </>
  )
}
