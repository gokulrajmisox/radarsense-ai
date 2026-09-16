/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1e293b',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      animation: {
        'draw-stroke': 'drawStroke 3s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        drawStroke: {
          '0%': { strokeDasharray: '0, 1000' },
          '100%': { strokeDasharray: '1000, 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(-90deg)' },
          '50%': { transform: 'rotate(90deg)' },
          '100%': { transform: 'rotate(-90deg)' },
        }
      }
    },
  },
  plugins: [],
}
