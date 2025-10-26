import { useState, useEffect } from 'react';
import { formatCurrentDateTime, getTimeZoneInfo, type TimeZoneInfo } from '../utils/timeUtils';

export function LiveTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tzInfo] = useState<TimeZoneInfo>(getTimeZoneInfo());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="text-center text-muted-foreground dark:text-[#a8b5cc] text-sm sm:text-base font-mono tracking-tight">
      {formatCurrentDateTime(currentTime, tzInfo)}
    </div>
  );
}
