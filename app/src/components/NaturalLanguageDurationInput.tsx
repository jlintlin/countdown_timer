import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { parseNaturalDuration, validateDurationMax, type Duration } from '../utils/timeUtils';
import { AlertCircle } from 'lucide-react';

interface NaturalLanguageDurationInputProps {
  value: Duration;
  onChange: (duration: Duration) => void;
  onValidationChange: (isValid: boolean) => void;
  autoFocus?: boolean;
}

export function NaturalLanguageDurationInput({ 
  value, 
  onChange, 
  onValidationChange,
  autoFocus = false
}: NaturalLanguageDurationInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize input value from duration
  useEffect(() => {
    if (value.hours === 0 && value.minutes === 0 && value.seconds === 0) {
      setInputValue('');
    }
  }, [value.hours, value.minutes, value.seconds]);
  
  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);
    
    if (!input.trim()) {
      setError('');
      onValidationChange(false);
      return;
    }
    
    const parsed = parseNaturalDuration(input);
    
    if (!parsed) {
      setError('Invalid format. Try: 5m, 1h 30m, 90m, or 01:30:20');
      onValidationChange(false);
      return;
    }
    
    if (!validateDurationMax(parsed)) {
      setError('Maximum duration is 99 hours.');
      onValidationChange(false);
      return;
    }
    
    setError('');
    onValidationChange(true);
    onChange(parsed);
  };
  
  return (
    <div className="space-y-3 w-full">
      <Label htmlFor="natural-duration" className="sr-only">Duration</Label>
      <Input
        ref={inputRef}
        id="natural-duration"
        type="text"
        placeholder="e.g., 5m, 1h 30m, 90m, 120s, 01:30:20"
        value={inputValue}
        onChange={handleChange}
        className={`h-14 text-center text-lg ${error ? 'border-destructive' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? 'duration-error' : 'duration-helper'}
      />
      {error ? (
        <div id="duration-error" className="flex items-center justify-center gap-2 text-destructive" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <p id="duration-helper" className="text-xs text-center text-muted-foreground">
          Examples: 5m · 1h 30m · 90m · 120s · 01:30:20
        </p>
      )}
    </div>
  );
}
