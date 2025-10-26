/**
 * Time utilities for countdown timer
 */

export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimeZoneInfo {
  label: string;
  offset: string;
  abbreviation: string;
}

/**
 * Get current timezone information
 */
export function getTimeZoneInfo(): TimeZoneInfo {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
  });
  
  const parts = formatter.formatToParts(now);
  const timeZonePart = parts.find(part => part.type === 'timeZoneName');
  const abbreviation = timeZonePart?.value || 'UTC';
  
  // Get UTC offset
  const offsetMinutes = -now.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes >= 0 ? '+' : '−';
  const offset = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
  
  return {
    label: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset,
    abbreviation,
  };
}

/**
 * Format current date and time
 */
export function formatCurrentDateTime(date: Date, tzInfo: TimeZoneInfo): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${month} ${day}, ${year} — ${hours}:${minutes}:${seconds} ${tzInfo.abbreviation} / ${tzInfo.offset}`;
}

/**
 * Parse natural language duration input
 * Supports formats like: "1h 30m 20s", "90m", "01:30:20", "5400"
 * Now supports flexible values like "75 minutes" or "90s"
 */
export function parseNaturalDuration(input: string): Duration | null {
  const trimmed = input.trim().toLowerCase();
  
  if (!trimmed) {
    return null;
  }
  
  let totalSeconds = 0;
  
  // Try HH:MM:SS or MM:SS format
  const colonFormat = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$|^(\d{1,2}):(\d{1,2})$/;
  const colonMatch = trimmed.match(colonFormat);
  
  if (colonMatch) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    if (colonMatch[1] && colonMatch[2] && colonMatch[3]) {
      // HH:MM:SS - validate that minutes and seconds are 0-59
      hours = parseInt(colonMatch[1], 10);
      minutes = parseInt(colonMatch[2], 10);
      seconds = parseInt(colonMatch[3], 10);
      
      if (minutes > 59 || seconds > 59) {
        return null; // Invalid time format
      }
    } else if (colonMatch[4] && colonMatch[5]) {
      // MM:SS - validate that seconds are 0-59
      minutes = parseInt(colonMatch[4], 10);
      seconds = parseInt(colonMatch[5], 10);
      
      if (seconds > 59) {
        return null; // Invalid time format
      }
    }
    
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
  } else {
    // Try natural language format: 1h 30m 20s, 90m, 120s, etc.
    const hourMatch = trimmed.match(/(\d+)\s*h/);
    const minMatch = trimmed.match(/(\d+)\s*m(?!s)/); // m but not followed by s
    const secMatch = trimmed.match(/(\d+)\s*s/);
    
    if (hourMatch || minMatch || secMatch) {
      const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
      const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
      const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;
      
      // No upper limit validation here - allow flexible values
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    } else {
      // Try plain number (assume seconds)
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num > 0) {
        totalSeconds = num;
      } else {
        return null;
      }
    }
  }
  
  // Check if total is at least 1 second
  if (totalSeconds < 1) {
    return null;
  }
  
  // Check maximum duration (99 hours = 356400 seconds)
  if (totalSeconds > 356400) {
    return null;
  }
  
  // Convert back to Duration format
  return secondsToDuration(totalSeconds);
}

/**
 * Convert duration to total seconds
 */
export function durationToSeconds(duration: Duration): number {
  return duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
}

/**
 * Convert seconds to duration
 */
export function secondsToDuration(totalSeconds: number): Duration {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { hours, minutes, seconds };
}

/**
 * Format duration for display in timer
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
}

/**
 * Format duration for natural language display
 */
export function formatDurationNatural(duration: Duration): string {
  const parts: string[] = [];
  
  if (duration.hours > 0) {
    parts.push(`${duration.hours}h`);
  }
  if (duration.minutes > 0) {
    parts.push(`${duration.minutes}m`);
  }
  if (duration.seconds > 0) {
    parts.push(`${duration.seconds}s`);
  }
  
  return parts.join(' ') || '0s';
}

/**
 * Get progress color based on percentage remaining
 * Now supports dark mode with vibrant colors
 */
export function getProgressColor(percentRemaining: number, isDark: boolean = false): string {
  if (isDark) {
    // Dark mode colors - more vibrant and saturated
    if (percentRemaining > 50) {
      return 'hsl(207, 85%, 65%)'; // Bright blue
    } else if (percentRemaining > 25) {
      return 'hsl(43, 95%, 65%)'; // Bright yellow
    } else if (percentRemaining > 10) {
      return 'hsl(25, 92%, 62%)'; // Bright orange
    } else {
      return 'hsl(5, 88%, 65%)'; // Bright red
    }
  } else {
    // Light mode colors
    if (percentRemaining > 50) {
      return 'hsl(200, 70%, 50%)'; // Cool blue
    } else if (percentRemaining > 25) {
      return 'hsl(45, 90%, 55%)'; // Warm yellow
    } else if (percentRemaining > 10) {
      return 'hsl(25, 85%, 55%)'; // Orange
    } else {
      return 'hsl(5, 75%, 55%)'; // Red
    }
  }
}

/**
 * Get background gradient based on percentage remaining
 * Returns both light and dark mode gradients with enhanced dark mode colors
 */
export function getBackgroundGradient(percentRemaining: number): { light: string; dark: string } {
  if (percentRemaining > 50) {
    return {
      light: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      dark: 'linear-gradient(135deg, #0a0e1a 0%, #1a2338 100%)'
    };
  } else if (percentRemaining > 25) {
    return {
      light: 'linear-gradient(135deg, #fff5e6 0%, #ffe0b3 100%)',
      dark: 'linear-gradient(135deg, #1a140a 0%, #2a2214 100%)'
    };
  } else if (percentRemaining > 10) {
    return {
      light: 'linear-gradient(135deg, #fff0e6 0%, #ffd4b3 100%)',
      dark: 'linear-gradient(135deg, #1f140e 0%, #331f14 100%)'
    };
  } else {
    return {
      light: 'linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)',
      dark: 'linear-gradient(135deg, #1f0e0e 0%, #331414 100%)'
    };
  }
}

/**
 * Validate duration max (99 hours)
 */
export function validateDurationMax(duration: Duration): boolean {
  return duration.hours <= 99;
}
