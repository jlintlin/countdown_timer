/**
 * Countdown Timer Application - Current Date/Time Display Component
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

type CurrentDateTimeVariant = 'default' | 'badge';

interface CurrentDateTimeProps {
  variant?: CurrentDateTimeVariant;
}

export const CurrentDateTime: React.FC<CurrentDateTimeProps> = ({ variant = 'default' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { formattedDate, formattedTime, timeZone } = useMemo(() => {
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // Get time zone abbreviation
    const timeZoneFormatter = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'short',
    });
    const parts = timeZoneFormatter.formatToParts(currentTime);
    const timeZonePart = parts.find((part) => part.type === 'timeZoneName');
    const tz = timeZonePart ? timeZonePart.value : '';

    return {
      formattedDate: dateFormatter.format(currentTime),
      formattedTime: timeFormatter.format(currentTime),
      timeZone: tz,
    };
  }, [currentTime]);

  const isBadge = variant === 'badge';

  const contentWithTz = `${formattedDate} · ${formattedTime} ${timeZone}`;

  if (isBadge) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg backdrop-blur sm:px-5 sm:py-2 sm:text-sm"
      >
        <span>{contentWithTz}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p className="text-[clamp(0.95rem,2.3vw,1.35rem)] font-medium text-white/90 drop-shadow-lg">
        {formattedDate} | {formattedTime} {timeZone}
      </p>
    </motion.div>
  );
};
