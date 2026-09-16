import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('nithesh@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'nithesh@gmail.com' && password === '12345678') {
      setError(false);
      setIsLoading(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } else {
      setError(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/50 rounded-full blur-3xl opacity-60 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/50 rounded-full blur-3xl opacity-60 mix-blend-multiply pointer-events-none"></div>

      {/* Header */}
      <div className="mb-10 text-center z-10">
        <div className="flex justify-center mb-2">
          {/* Mini Hello SVG for branding */}
          <svg viewBox="0 0 200 80" className="w-32 h-16 drop-shadow-sm">
            <defs>
              <linearGradient id="hello-mini" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="33%" stopColor="#8b5cf6" />
                <stop offset="66%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <path
              d="M35 45 C 35 45, 40 25, 47 25 C 55 25, 50 47, 50 47 C 50 47, 55 37, 62 37 C 70 37, 65 47, 70 47 C 75 47, 80 42, 87 37 C 92 32, 85 25, 80 32 C 75 40, 80 47, 87 47 C 95 47, 100 32, 100 25 C 100 17, 105 27, 107 47 C 110 67, 102 65, 102 65 C 102 65, 110 35, 115 30 C 120 25, 117 47, 122 47 C 127 47, 132 37, 140 37 C 147 37, 145 47, 152 47 C 160 47, 165 40, 170 35"
              fill="transparent"
              strokeWidth="4"
              stroke="url(#hello-mini)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">RadarSense AI</h1>
        <p className="text-xs text-slate-500 mt-2 font-medium tracking-widest uppercase">Smart Detection &bull; Real-Time Alerts &bull; AI Powered</p>
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 z-10 mx-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to continue to your radar dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Email address"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-500 text-sm text-center font-medium"
            >
              Invalid email or password
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md font-medium transition-all disabled:opacity-80"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Login \u2192"
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center text-sm text-green-600 font-medium">
          <ShieldCheck className="h-4 w-4 mr-1.5" />
          Secure Login
        </div>
      </motion.div>
    </motion.div>
  );
}
