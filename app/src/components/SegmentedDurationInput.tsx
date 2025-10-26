import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Duration } from '../utils/timeUtils';

interface SegmentedDurationInputProps {
  value: Duration;
  onChange: (duration: Duration) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function SegmentedDurationInput({ 
  value, 
  onChange, 
  onValidationChange 
}: SegmentedDurationInputProps) {
  
  const handleHoursChange = (hours: string) => {
    const newDuration = { ...value, hours: parseInt(hours, 10) };
    onChange(newDuration);
    validateDuration(newDuration);
  };
  
  const handleMinutesChange = (minutes: string) => {
    const newDuration = { ...value, minutes: parseInt(minutes, 10) };
    onChange(newDuration);
    validateDuration(newDuration);
  };
  
  const handleSecondsChange = (seconds: string) => {
    const newDuration = { ...value, seconds: parseInt(seconds, 10) };
    onChange(newDuration);
    validateDuration(newDuration);
  };
  
  const validateDuration = (duration: Duration) => {
    const total = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
    onValidationChange(total >= 1);
  };
  
  // Generate options for hours (0-99)
  const hourOptions = Array.from({ length: 100 }, (_, i) => i);
  // Generate options for minutes and seconds (0-59)
  const minuteSecondOptions = Array.from({ length: 60 }, (_, i) => i);
  
  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours" className="text-center block text-sm">Hours</Label>
          <Select 
            value={value.hours.toString()} 
            onValueChange={handleHoursChange}
          >
            <SelectTrigger id="hours" className="w-full h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hourOptions.map(h => (
                <SelectItem key={h} value={h.toString()}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="minutes" className="text-center block text-sm">Minutes</Label>
          <Select 
            value={value.minutes.toString()} 
            onValueChange={handleMinutesChange}
          >
            <SelectTrigger id="minutes" className="w-full h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minuteSecondOptions.map(m => (
                <SelectItem key={m} value={m.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seconds" className="text-center block text-sm">Seconds</Label>
          <Select 
            value={value.seconds.toString()} 
            onValueChange={handleSecondsChange}
          >
            <SelectTrigger id="seconds" className="w-full h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minuteSecondOptions.map(s => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        Range: 0–99 hours · 0–59 minutes/seconds
      </p>
    </div>
  );
}
