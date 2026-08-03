import { motion } from "framer-motion";

const JUICE_DROPS = [
  { yTarget: -65, xTarget: -45, duration: 0.7, delay: 0.1 },
  { yTarget: -72, xTarget: 38, duration: 0.9, delay: 0.3 },
  { yTarget: -55, xTarget: -32, duration: 0.6, delay: 0.0 },
  { yTarget: -68, xTarget: 47, duration: 0.8, delay: 0.4 },
  { yTarget: -78, xTarget: -36, duration: 1.0, delay: 0.2 },
  { yTarget: -60, xTarget: 41, duration: 0.7, delay: 0.5 },
];

export function SqueezingLemonLoader() {
  return (
    <div className="flex flex-col items-center justify-center relative w-24 h-24">
      {/* Juice Drops */}
      {JUICE_DROPS.map((drop, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#FFD95A] rounded-full border border-black/20"
          animate={{
            y: [-10, drop.yTarget],
            x: [(i % 2 === 0 ? -1 : 1) * 10, drop.xTarget],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0]
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
            delay: drop.delay
          }}
        />
      ))}
      {/* Geometric Lemon Squeeze */}
      <motion.div
        animate={{
          scaleY: [1, 0.65, 1],
          scaleX: [1, 1.25, 1],
        }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 28 80 C 8 90, 8 50, 28 30 C 48 10, 88 10, 78 30 C 98 40, 98 80, 78 80 C 58 100, 18 100, 28 80 Z" fill="#111111" className="opacity-20" transform="translate(0, 4)"/>
          <path d="M 25 75 C 5 85, 5 45, 25 25 C 45 5, 85 5, 75 25 C 95 15, 95 55, 75 75 C 55 95, 15 95, 25 75 Z" fill="#FFD95A" stroke="#111" strokeWidth="5" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  )
}
