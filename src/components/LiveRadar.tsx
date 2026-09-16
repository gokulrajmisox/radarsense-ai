import { motion } from 'framer-motion';

export default function LiveRadar({ angle, distance }: { angle: number, distance: number }) {
  // Convert polar coordinates to cartesian for the target dot
  // SVG coordinates: 0,0 is top left. We center at 200, 200 (for a 400x200 half-circle, let's use a 400x250 svg with center at 200,200)
  
  // Math: 0 degrees is right (x=r, y=0), 180 degrees is left (x=-r, y=0)
  // Our angle is 0 to 180, where 0 is right, 90 is straight up, 180 is left.
  // We need to map distance to a radius. Max distance is ~150 in our mock. Let's scale distance * 1.2
  
  const radius = Math.min(distance * 1.2, 180); 
  const angleRad = (angle * Math.PI) / 180;
  
  // In SVG, Y goes down. So we subtract Y.
  const targetX = 200 + radius * Math.cos(angleRad);
  const targetY = 200 - radius * Math.sin(angleRad);

  return (
    <div className="relative w-full max-w-[400px] aspect-[4/2.5] flex items-end justify-center">
      <svg viewBox="0 0 400 250" className="w-full h-full overflow-visible">
        {/* Radar base gradients */}
        <defs>
          <radialGradient id="radar-glow" cx="50%" cy="100%" r="100%" fx="50%" fy="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer glowing background */}
        <path d="M 20 200 A 180 180 0 0 1 380 200 L 200 200 Z" fill="url(#radar-glow)" />

        {/* Distance Rings */}
        {[45, 90, 135, 180].map((r, i) => (
          <path
            key={i}
            d={`M ${200 - r} 200 A ${r} ${r} 0 0 1 ${200 + r} 200`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray={i % 2 === 0 ? "4 4" : "none"}
          />
        ))}

        {/* Angle Lines */}
        {[30, 60, 90, 120, 150].map((a, i) => {
          const r = 180;
          const rad = (a * Math.PI) / 180;
          const x2 = 200 + r * Math.cos(rad);
          const y2 = 200 - r * Math.sin(rad);
          return (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Labels */}
        <text x="10" y="215" fill="#94a3b8" fontSize="12" fontWeight="500">180°</text>
        <text x="375" y="215" fill="#94a3b8" fontSize="12" fontWeight="500">0°</text>
        <text x="192" y="15" fill="#94a3b8" fontSize="12" fontWeight="500">90°</text>

        {/* Scanning Beam */}
        {/* We rotate around (200, 200). SVG transform rotation is clockwise, so we need to map our angle.
            Our angle is 0 to 180 counter-clockwise. SVG rotate is clockwise.
            So we rotate by -angle from the 0 degree line (which is rightwards).
        */}
        <motion.g
          style={{ originX: 0, originY: 1 }}
          animate={{ rotate: -angle }}
          transition={{ type: 'tween', duration: 0.1, ease: 'linear' }}
        >
          {/* The beam itself - a sector */}
          <path
            d="M 200 200 L 380 200 A 180 180 0 0 0 378 175 Z"
            fill="url(#beam-gradient)"
            opacity="0.6"
          />
          {/* Leading edge line */}
          <line x1="200" y1="200" x2="380" y2="200" stroke="#3b82f6" strokeWidth="2" />
        </motion.g>

        {/* Base center point */}
        <circle cx="200" cy="200" r="6" fill="#3b82f6" />
        <circle cx="200" cy="200" r="16" fill="#3b82f6" opacity="0.2" className="animate-ping" />

        {/* Target Dot - Only show if distance is within range (< 150) */}
        {distance < 150 && (
          <motion.g
            animate={{ x: targetX, y: targetY }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <circle cx="0" cy="0" r="5" fill={distance < 50 ? '#ef4444' : distance < 100 ? '#f59e0b' : '#10b981'} />
            <circle 
              cx="0" 
              cy="0" 
              r="12" 
              fill={distance < 50 ? '#ef4444' : distance < 100 ? '#f59e0b' : '#10b981'} 
              opacity="0.4" 
              className="animate-ping" 
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
