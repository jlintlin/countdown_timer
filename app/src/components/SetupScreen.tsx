import { useState, useEffect } from 'react';
import { LiveTimeDisplay } from './LiveTimeDisplay';
import { NaturalLanguageDurationInput } from './NaturalLanguageDurationInput';
import { SegmentedDurationInput } from './SegmentedDurationInput';
import { ThemeToggle } from './ThemeToggle';
import { TimerHistory } from './TimerHistory';
import { Button } from './ui/button';
import { Toggle } from './ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { durationToSeconds, formatTimerDisplay, formatDurationNatural, type Duration } from '../utils/timeUtils';
import { saveTimerToHistory } from '../utils/historyUtils';
import { Type, ListOrdered, Clock, Zap } from 'lucide-react';

interface SetupScreenProps {
  onStart: (totalSeconds: number) => void;
}

const PRESET_DURATIONS: Array<{ label: string; duration: Duration }> = [
  { label: '1 min', duration: { hours: 0, minutes: 1, seconds: 0 } },
  { label: '5 min', duration: { hours: 0, minutes: 5, seconds: 0 } },
  { label: '10 min', duration: { hours: 0, minutes: 10, seconds: 0 } },
  { label: '15 min', duration: { hours: 0, minutes: 15, seconds: 0 } },
  { label: '30 min', duration: { hours: 0, minutes: 30, seconds: 0 } },
  { label: '1 hour', duration: { hours: 1, minutes: 0, seconds: 0 } },
];

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [duration, setDuration] = useState<Duration>({ hours: 0, minutes: 0, seconds: 0 });
  const [inputMethod, setInputMethod] = useState<'type' | 'pick'>('type');
  const [isValid, setIsValid] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  
  const handleClear = () => {
    setDuration({ hours: 0, minutes: 0, seconds: 0 });
    setIsValid(false);
  };
  
  const handleStart = () => {
    const totalSeconds = durationToSeconds(duration);
    if (totalSeconds >= 1) {
      // Save to history
      saveTimerToHistory(duration, totalSeconds);
      onStart(totalSeconds);
    }
  };
  
  const handlePresetSelect = (presetDuration: Duration) => {
    setDuration(presetDuration);
    setIsValid(true);
    setShowPresets(false);
  };
  
  const handleHistorySelect = (item: any) => {
    setDuration(item.duration);
    setIsValid(true);
  };
  
  const totalSeconds = durationToSeconds(duration);
  const canStart = isValid && totalSeconds >= 1;
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - Floating Glass Bar */}
      <header className="glass-primary border-b-0 m-3 rounded-2xl overflow-hidden flex-shrink-0">
        <div className="container max-w-4xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <LiveTimeDisplay />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 overflow-y-auto">
        <div className="w-full max-w-xl space-y-4">
          {/* Page Title */}
          <div className="text-center space-y-1">
            <h1 className="dark:text-[#e8f0f8]" style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Set Your Timer</h1>
            <p className="text-muted-foreground dark:text-[#a8b5cc]" style={{ fontSize: '1rem' }}>Choose a preset or enter a custom duration</p>
          </div>
          
          {/* Quick Start & History */}
          <div className="flex justify-center gap-2">
            <Popover open={showPresets} onOpenChange={setShowPresets}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Start
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="center">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Preset Durations</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_DURATIONS.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(preset.duration)}
                        className="h-10"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <TimerHistory onSelectTimer={handleHistorySelect} />
          </div>
          
          {/* Input Section - Glass Card */}
          <div className="space-y-4 glass-primary rounded-3xl p-5">
            {/* Input Method Toggle */}
            <div className="flex items-center justify-center gap-2">
              <Toggle
                pressed={inputMethod === 'type'}
                onPressedChange={(pressed) => pressed && setInputMethod('type')}
                aria-label="Type duration"
                className="gap-2 rounded-2xl px-5 h-10 transition-all duration-300"
              >
                <Type className="h-4 w-4" />
                Type
              </Toggle>
              <Toggle
                pressed={inputMethod === 'pick'}
                onPressedChange={(pressed) => pressed && setInputMethod('pick')}
                aria-label="Pick duration"
                className="gap-2 rounded-2xl px-5 h-10 transition-all duration-300"
              >
                <ListOrdered className="h-4 w-4" />
                Pick
              </Toggle>
            </div>
            
            {/* Duration Input */}
            <div className="min-h-[100px] flex items-center">
              {inputMethod === 'type' ? (
                <NaturalLanguageDurationInput
                  value={duration}
                  onChange={setDuration}
                  onValidationChange={setIsValid}
                  autoFocus={true}
                />
              ) : (
                <SegmentedDurationInput
                  value={duration}
                  onChange={setDuration}
                  onValidationChange={setIsValid}
                />
              )}
            </div>
            
            {/* Duration Preview */}
            {totalSeconds > 0 && (
              <div className="text-center space-y-2 pt-4 border-t border-white/10 dark:border-[#8ba0c5]/20">
                <p className="text-sm text-muted-foreground dark:text-[#a8b5cc]">Timer will be set to:</p>
                <div 
                  className="font-mono tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-[#e8f0f8] dark:to-[#d1dce8] dark:drop-shadow-[0_0_8px_rgba(99,179,237,0.2)]" 
                  style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1 }}
                >
                  {formatTimerDisplay(totalSeconds)}
                </div>
                <p className="text-xs text-muted-foreground">
                  ({formatDurationNatural(duration)})
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleStart}
                disabled={!canStart}
                className="flex-1 h-12 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Timer
              </Button>
              {totalSeconds > 0 && (
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="h-12 px-5 rounded-2xl glass-secondary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* Helper Text */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Duration: 1 second to 99 hours</p>
          </div>
        </div>
      </main>
    </div>
  );
}
