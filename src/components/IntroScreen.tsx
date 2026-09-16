import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubtitle(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
    >
      <div className="relative flex flex-col items-center">
        {/* Hello SVG Animation */}
        <div className="relative w-64 h-32 md:w-96 md:h-48 flex items-center justify-center">
          {/* Subtle glow behind the text */}
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full scale-150 animate-pulse-slow"></div>
          
          <svg viewBox="0 0 400 150" className="w-full h-full drop-shadow-xl z-10">
            <defs>
              <linearGradient id="hello-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="33%" stopColor="#8b5cf6" />
                <stop offset="66%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <motion.path
              d="M70 90 C 70 90, 80 50, 95 50 C 110 50, 100 95, 100 95 C 100 95, 110 75, 125 75 C 140 75, 130 95, 140 95 C 150 95, 160 85, 175 75 C 185 65, 170 50, 160 65 C 150 80, 160 95, 175 95 C 190 95, 200 65, 200 50 C 200 35, 210 55, 215 95 C 220 135, 205 130, 205 130 C 205 130, 220 70, 230 60 C 240 50, 235 95, 245 95 C 255 95, 265 75, 280 75 C 295 75, 290 95, 305 95 C 320 95, 330 80, 340 70"
              fill="transparent"
              strokeWidth="8"
              stroke="url(#hello-gradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Subtitles */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showSubtitle ? 1 : 0, y: showSubtitle ? 0 : 10 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mt-4"
        >
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Welcome to RadarSense AI</h1>
          <p className="text-sm text-slate-500 mt-2 tracking-wide font-medium">Smart Detection &bull; Real-Time Alerts &bull; AI Powered</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
