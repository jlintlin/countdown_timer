import { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { ActiveTimerScreen } from './components/ActiveTimerScreen';
import { DocumentHead } from './components/DocumentHead';
import { Toaster } from './components/ui/sonner';
import { formatTimerDisplay } from './utils/timeUtils';

type AppState = 
  | { screen: 'setup' }
  | { screen: 'active'; totalSeconds: number };

export default function App() {
  const [appState, setAppState] = useState<AppState>({ screen: 'setup' });
  
  // Initialize theme on mount
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const handleStart = (totalSeconds: number) => {
    setAppState({ screen: 'active', totalSeconds });
  };
  
  const handleReset = () => {
    setAppState({ screen: 'setup' });
  };
  
  // Dynamic document title
  const documentTitle = appState.screen === 'active' 
    ? `Timer Running - Countdown Timer`
    : 'Countdown Timer';
  
  return (
    <>
      <DocumentHead title={documentTitle} />
      {appState.screen === 'setup' ? (
        <SetupScreen onStart={handleStart} />
      ) : (
        <ActiveTimerScreen 
          initialSeconds={appState.totalSeconds} 
          onReset={handleReset} 
        />
      )}
      <Toaster richColors closeButton />
    </>
  );
}