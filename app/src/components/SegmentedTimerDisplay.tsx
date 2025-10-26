interface SegmentedTimerDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  isWarning?: boolean;
}

export function SegmentedTimerDisplay({ 
  hours, 
  minutes, 
  seconds,
  isWarning = false 
}: SegmentedTimerDisplayProps) {
  const hasHours = hours > 0;
  
  // Format numbers with leading zeros
  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  
  return (
    <div 
      className="flex items-center justify-center gap-1 sm:gap-2"
      role="timer"
      aria-label={`${hasHours ? hours + ' hours ' : ''}${minutes} minutes ${seconds} seconds remaining`}
    >
      {/* Hours */}
      {hasHours && (
        <>
          <TimeSegment 
            value={formatNumber(hours)} 
            label="hr"
            isWarning={isWarning}
          />
          <TimeSeparator isWarning={isWarning} />
        </>
      )}
      
      {/* Minutes */}
      <TimeSegment 
        value={formatNumber(minutes)} 
        label="min"
        isWarning={isWarning}
      />
      <TimeSeparator isWarning={isWarning} />
      
      {/* Seconds */}
      <TimeSegment 
        value={formatNumber(seconds)} 
        label="sec"
        isWarning={isWarning}
        isPrimary
      />
    </div>
  );
}

function TimeSegment({ 
  value, 
  label,
  isWarning,
  isPrimary = false
}: { 
  value: string; 
  label: string;
  isWarning: boolean;
  isPrimary?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5">
      <div 
        className={`
          font-mono tracking-tight px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl
          timer-segment-glass transition-all duration-300
          relative overflow-hidden
          ${isWarning ? 'animate-pulse scale-105' : 'scale-100'}
          ${isPrimary ? 'timer-segment-glass-primary' : 'timer-segment-glass-secondary'}
        `}
      >
        {/* Glass shine effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none dark:from-[#8ba0c5]/15 dark:to-transparent"
          style={{ borderRadius: 'inherit' }}
        />
        
        {/* Number */}
        <div
          className="relative bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent dark:from-[#e8f0f8] dark:via-[#d1dce8] dark:to-[#e8f0f8]/90 dark:drop-shadow-[0_0_8px_rgba(99,179,237,0.3)]"
          style={{ 
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.03em'
          }}
        >
          {value}
        </div>
      </div>
      <span 
        className="text-muted-foreground uppercase tracking-wider opacity-70 dark:opacity-90 dark:text-[#a8b5cc]"
        style={{ fontSize: 'clamp(0.625rem, 1.75vw, 0.875rem)', fontWeight: 600 }}
      >
        {label}
      </span>
    </div>
  );
}

function TimeSeparator({ isWarning }: { isWarning: boolean }) {
  return (
    <div 
      className={`
        flex flex-col justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6
        ${isWarning ? 'animate-pulse' : ''}
      `}
    >
      <div 
        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-muted-foreground to-muted-foreground/50 opacity-50 dark:from-[#a8b5cc] dark:to-[#8ba0c5]/60 dark:opacity-70"
      />
      <div 
        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-muted-foreground to-muted-foreground/50 opacity-50 dark:from-[#a8b5cc] dark:to-[#8ba0c5]/60 dark:opacity-70"
      />
    </div>
  );
}
