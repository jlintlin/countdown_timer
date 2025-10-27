import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { CircularProgress } from './CircularProgress';
import { SegmentedTimerDisplay } from './SegmentedTimerDisplay';
import { ThemeToggle } from './ThemeToggle';
import { LiveTimeDisplay } from './LiveTimeDisplay';
import { SoundPicker } from './SoundPicker';
import { NotificationSettings } from './NotificationSettings';
import { useTheme } from '../hooks/useTheme';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  formatTimerDisplay, 
  formatDurationNatural, 
  secondsToDuration,
  getBackgroundGradient 
} from '../utils/timeUtils';
import { SoundPlayer, getSoundPreference, getVolumePreference } from '../utils/soundUtils';
import { sendTimerCompleteNotification, getNotificationPreference } from '../utils/notificationUtils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus,
  ArrowLeft 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ActiveTimerScreenProps {
  initialSeconds: number;
  onReset: () => void;
}

export function ActiveTimerScreen({ initialSeconds, onReset }: ActiveTimerScreenProps) {
  const { theme } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedSinceComplete, setElapsedSinceComplete] = useState(0);
  const [lastAnnouncement, setLastAnnouncement] = useState<number | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [selectedSound, setSelectedSound] = useState(() => getSoundPreference());
  const [volume, setVolume] = useState(() => getVolumePreference());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundPlayerRef = useRef<SoundPlayer>(new SoundPlayer());
  
  // Calculate progress percentage
  const progressPercentage = (timeRemaining / initialSeconds) * 100;
  
  // Background gradient based on time remaining
  const backgroundGradients = getBackgroundGradient(progressPercentage);
  const backgroundGradient = theme === 'dark' ? backgroundGradients.dark : backgroundGradients.light;
  
  // Flash effect for final 10 seconds
  const shouldFlash = timeRemaining <= 10 && timeRemaining > 0 && !isPaused;
  
  useEffect(() => {
    if (!isPaused && !isComplete && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, isComplete, timeRemaining]);
  
  useEffect(() => {
    if (timeRemaining === 0 && !isComplete) {
      setIsComplete(true);
      const durationText = formatDurationNatural(secondsToDuration(initialSeconds));
      
      toast.success("Time's up!", {
        description: `Your ${durationText} timer has completed.`,
        duration: 5000,
      });
      
      // Play sound if not muted
      if (volume > 0) {
        soundPlayerRef.current.playSound(selectedSound, volume);
      }
      
      // Send notification if enabled
      if (getNotificationPreference()) {
        sendTimerCompleteNotification(durationText);
      }
      
      // Start counting elapsed time since completion
      completeIntervalRef.current = setInterval(() => {
        setElapsedSinceComplete(prev => prev + 1);
      }, 1000);
    }
    
    // Announce milestones for accessibility
    if (!isComplete && !isPaused) {
      if (timeRemaining === 60 && lastAnnouncement !== 60) {
        setLastAnnouncement(60);
        toast.info('1 minute remaining');
      } else if (timeRemaining === 10 && lastAnnouncement !== 10) {
        setLastAnnouncement(10);
        toast.warning('10 seconds remaining');
      }
    }
    
    return () => {
      if (completeIntervalRef.current) {
        clearInterval(completeIntervalRef.current);
      }
    };
  }, [timeRemaining, isComplete, initialSeconds, isPaused, lastAnnouncement, selectedSound, volume]);
  
  const handlePauseResume = () => {
    if (isComplete) return;
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Timer resumed' : 'Timer paused');
  };
  
  const handleResetClick = () => {
    setShowResetDialog(true);
  };
  
  const handleResetConfirm = () => {
    setTimeRemaining(initialSeconds);
    setIsPaused(false);
    setIsComplete(false);
    setElapsedSinceComplete(0);
    if (completeIntervalRef.current) {
      clearInterval(completeIntervalRef.current);
    }
    setShowResetDialog(false);
    toast.info('Timer reset');
  };
  
  const handleAddMinute = () => {
    if (isComplete) return;
    setTimeRemaining(prev => Math.min(prev + 60, initialSeconds + 3600)); // Cap at initial + 1 hour
    toast.success('Added 1 minute');
  };
  
  const handleSubtractMinute = () => {
    if (isComplete) return;
    setTimeRemaining(prev => Math.max(prev - 60, 0));
    toast.success('Removed 1 minute');
  };
  
  const handleRestart = () => {
    setTimeRemaining(initialSeconds);
    setIsPaused(false);
    setIsComplete(false);
    setElapsedSinceComplete(0);
    if (completeIntervalRef.current) {
      clearInterval(completeIntervalRef.current);
    }
    toast.info('Timer restarted');
  };
  
  const handleBackToSetupClick = () => {
    // Show confirmation if timer is running or paused (not complete)
    if (!isComplete && timeRemaining > 0) {
      setShowBackDialog(true);
    } else {
      onReset();
    }
  };
  
  const handleBackToSetupConfirm = () => {
    setShowBackDialog(false);
    onReset();
  };
  
  // Cleanup sound player
  useEffect(() => {
    return () => {
      soundPlayerRef.current.cleanup();
    };
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePauseResume();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleResetClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, isComplete, timeRemaining]);
  
  const completeGradient = theme === 'dark'
    ? 'linear-gradient(135deg, #1a0a0f 0%, #2d1520 100%)'
    : 'linear-gradient(135deg, #ffe0e0 0%, #ffb3b3 100%)';
  
  return (
    <div 
      className="h-screen flex flex-col overflow-hidden transition-all duration-1000"
      style={{ 
        background: isComplete 
          ? completeGradient
          : backgroundGradient 
      }}
    >
      {/* Header - Floating Glass Bar */}
      <header className="glass-primary border-b-0 m-3 rounded-2xl overflow-hidden flex-shrink-0">
        <div className="container max-w-6xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-3 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSetupClick}
              className="gap-2 rounded-xl hover:bg-white/10 transition-all duration-300 dark:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <NotificationSettings />
              <SoundPicker 
                onSoundChange={setSelectedSound}
                onVolumeChange={setVolume}
              />
              <ThemeToggle />
            </div>
          </div>
          <LiveTimeDisplay />
        </div>
      </header>
      
      {/* Main Timer Display */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-4">
          {!isComplete ? (
            <>
              {/* Circular Progress and Timer - Glass Container */}
              <div className="glass-primary rounded-[3rem] p-6 sm:p-8 md:p-10 mx-auto max-w-fit">
                <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] mx-auto">
                  <CircularProgress percentage={progressPercentage} />
                  <div 
                    className="absolute inset-0 flex items-center justify-center px-4 sm:px-6"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <SegmentedTimerDisplay
                      hours={Math.floor(timeRemaining / 3600)}
                      minutes={Math.floor((timeRemaining % 3600) / 60)}
                      seconds={timeRemaining % 60}
                      isWarning={shouldFlash}
                    />
                  </div>
                </div>
              </div>
              
              {/* Status Text */}
              <div className="text-center glass-secondary rounded-2xl py-2 px-4 mx-auto max-w-fit">
                {isPaused ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full dark:bg-[#a8b5cc]" />
                    <p className="text-sm text-muted-foreground dark:text-[#a8b5cc]">Paused</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      timeRemaining <= 10 ? 'bg-destructive animate-pulse dark:bg-[#ff6b7a] dark:shadow-[0_0_12px_rgba(255,107,122,0.5)]' : 'bg-green-500 dark:bg-[#63b3ed] dark:shadow-[0_0_8px_rgba(99,179,237,0.4)]'
                    }`} />
                    <p className="text-sm text-muted-foreground dark:text-[#a8b5cc]">
                      {timeRemaining <= 10 ? 'Final countdown...' : 'Timer running'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Controls */}
              <div className="space-y-2 w-full max-w-md mx-auto">
                {/* Primary Controls */}
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handlePauseResume}
                    className="flex-1 max-w-[160px] h-12 gap-2 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] dark:text-white"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleResetClick}
                    variant="outline"
                    className="flex-1 max-w-[160px] h-12 gap-2 rounded-2xl glass-secondary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] dark:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </Button>
                </div>
                
                {/* Adjustment Controls */}
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleSubtractMinute}
                    variant="secondary"
                    className="flex-1 max-w-[130px] h-10 gap-2 rounded-2xl glass-tertiary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] dark:text-white"
                    disabled={timeRemaining === 0}
                  >
                    <Minus className="h-4 w-4" />
                    <span>1 min</span>
                  </Button>
                  <Button
                    onClick={handleAddMinute}
                    variant="secondary"
                    className="flex-1 max-w-[130px] h-10 gap-2 rounded-2xl glass-tertiary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] dark:text-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>1 min</span>
                  </Button>
                </div>
              </div>
              
              {/* Keyboard Shortcuts */}
              <div className="text-center text-xs text-muted-foreground dark:text-[#a8b5cc] hidden sm:block glass-tertiary rounded-xl py-1.5 px-3 mx-auto max-w-fit">
                <p><kbd className="px-1.5 py-0.5 glass-secondary rounded text-foreground dark:text-white mx-1">Space</kbd> Pause/Resume • <kbd className="px-1.5 py-0.5 glass-secondary rounded text-foreground dark:text-white mx-1">R</kbd> Reset</p>
              </div>
            </>
          ) : (
            /* Complete State */
            <div className="text-center space-y-5">
              <div className="space-y-4 glass-primary rounded-3xl p-6 sm:p-8">
                <h1
                  className="text-destructive bg-gradient-to-br from-[#FF3B30] to-[#FF3B30]/70 bg-clip-text text-transparent dark:from-[#ff8c9b] dark:to-[#ff8c9b]/85 dark:drop-shadow-[0_0_16px_rgba(255,140,155,0.4)]"
                  style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em' }}
                >
                  Time's up!
                </h1>
                <p className="text-muted-foreground dark:text-[#c8d2e6]">
                  Your {formatDurationNatural(secondsToDuration(initialSeconds))} timer has completed.
                </p>
                {elapsedSinceComplete > 0 && (
                  <div className="glass-secondary rounded-2xl py-2 px-4 mx-auto max-w-fit">
                    <p className="text-sm text-muted-foreground dark:text-[#c8d2e6]">
                      Elapsed: {formatTimerDisplay(elapsedSinceComplete)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-center flex-wrap px-4">
                <Button
                  onClick={handleRestart}
                  className="flex-1 min-w-[140px] max-w-[180px] h-12 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] dark:text-white dark:bg-[rgba(99,179,237,0.25)] dark:border-[rgba(99,179,237,0.4)]"
                >
                  Restart Timer
                </Button>
                <Button
                  onClick={handleBackToSetupClick}
                  variant="outline"
                  className="flex-1 min-w-[140px] max-w-[180px] h-12 rounded-2xl glass-secondary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] dark:text-[#e8f0f8] dark:bg-[rgba(76,92,122,0.3)] dark:border-[rgba(139,160,197,0.3)]"
                >
                  Back to Setup
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Timer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the timer back to {formatDurationNatural(secondsToDuration(initialSeconds))}. 
              {timeRemaining > 0 && !isComplete && (
                <span className="block mt-2 font-medium">
                  Current progress will be lost.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirm}>
              Reset Timer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Back to Setup Confirmation Dialog */}
      <AlertDialog open={showBackDialog} onOpenChange={setShowBackDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Timer?</AlertDialogTitle>
            <AlertDialogDescription>
              Your timer is still running with {formatTimerDisplay(timeRemaining)} remaining.
              <span className="block mt-2 font-medium">
                Are you sure you want to go back and set up a new timer?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Timer</AlertDialogCancel>
            <AlertDialogAction onClick={handleBackToSetupConfirm}>
              Back to Setup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
