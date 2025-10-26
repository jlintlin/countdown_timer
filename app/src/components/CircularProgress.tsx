import { getProgressColor } from '../utils/timeUtils';
import { useEffect, useState } from 'react';

interface CircularProgressProps {
  percentage: number; // 0-100
}

export function CircularProgress({ percentage }: CircularProgressProps) {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  const color = getProgressColor(percentage, isDark);
  
  return (
    <div className="relative w-full aspect-square mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full transform -rotate-90 drop-shadow-2xl"
        role="img"
        aria-label={`${percentage.toFixed(0)}% time remaining`}
        style={{ filter: isDark ? 'drop-shadow(0 4px 32px rgba(99, 179, 237, 0.2))' : 'drop-shadow(0 4px 24px rgba(0, 0, 0, 0.15))' }}
      >
        {/* Outer glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation={isDark ? "4" : "3"} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          className={isDark ? "text-[#4c5c7a]" : "text-muted/20"}
          opacity={isDark ? "0.3" : "0.5"}
        />
        
        {/* Progress circle with glow */}
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeDasharray={2 * Math.PI * 82}
          strokeDashoffset={2 * Math.PI * 82 * (1 - percentage / 100)}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{ filter: 'url(#glow)' }}
        />
      </svg>
    </div>
  );
}
