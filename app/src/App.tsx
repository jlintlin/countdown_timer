import { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { ActiveTimerScreen } from './components/ActiveTimerScreen';
import { DocumentHead } from './components/DocumentHead';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './hooks/useTheme';

type AppState =
  | { screen: 'setup' }
  | { screen: 'active'; totalSeconds: number };

export default function App() {
  const [appState, setAppState] = useState<AppState>({ screen: 'setup' });

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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}