import { useEffect } from 'react';

interface DocumentHeadProps {
  title?: string;
}

export function DocumentHead({ title = 'Countdown Timer' }: DocumentHeadProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return null;
}
