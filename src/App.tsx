import { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

export default function App() {
  const [appState, setAppState] = useState<'intro' | 'login' | 'dashboard'>('intro');

  useEffect(() => {
    // Show intro for 3 seconds, then transition to login
    const timer = setTimeout(() => {
      setAppState('login');
    }, 4000); // 4 seconds total (3s animation + 1s hold)
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-blue-200">
      {appState === 'intro' && <IntroScreen />}
      {appState === 'login' && <LoginScreen onLoginSuccess={() => setAppState('dashboard')} />}
      {appState === 'dashboard' && <Dashboard />}
    </div>
  );
}
