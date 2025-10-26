import type { Duration } from './timeUtils';

export type TimerHistoryItem = {
  id: string;
  duration: Duration;
  totalSeconds: number;
  label?: string;
  isFavorite: boolean;
  createdAt: number;
  lastUsed: number;
  useCount: number;
};

const HISTORY_KEY = 'timer-history';
const MAX_HISTORY_ITEMS = 50;

export function getTimerHistory(): TimerHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load timer history:', error);
    return [];
  }
}

export function saveTimerToHistory(duration: Duration, totalSeconds: number, label?: string): TimerHistoryItem {
  const history = getTimerHistory();
  
  // Check if this exact duration already exists
  const existingIndex = history.findIndex(
    (item) => 
      item.duration.hours === duration.hours &&
      item.duration.minutes === duration.minutes &&
      item.duration.seconds === duration.seconds
  );
  
  if (existingIndex !== -1) {
    // Update existing entry
    const existing = history[existingIndex];
    existing.lastUsed = Date.now();
    existing.useCount += 1;
    if (label) existing.label = label;
    
    // Move to front
    history.splice(existingIndex, 1);
    history.unshift(existing);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return existing;
  } else {
    // Create new entry
    const newItem: TimerHistoryItem = {
      id: `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      duration,
      totalSeconds,
      label,
      isFavorite: false,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      useCount: 1,
    };
    
    // Add to front of history
    history.unshift(newItem);
    
    // Trim to max size (keep favorites regardless of position)
    const favorites = history.filter(item => item.isFavorite);
    const nonFavorites = history.filter(item => !item.isFavorite).slice(0, MAX_HISTORY_ITEMS - favorites.length);
    const trimmedHistory = [...favorites, ...nonFavorites].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    return newItem;
  }
}

export function toggleFavorite(itemId: string): void {
  const history = getTimerHistory();
  const item = history.find(h => h.id === itemId);
  
  if (item) {
    item.isFavorite = !item.isFavorite;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

export function updateTimerLabel(itemId: string, label: string): void {
  const history = getTimerHistory();
  const item = history.find(h => h.id === itemId);
  
  if (item) {
    item.label = label || undefined;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

export function deleteHistoryItem(itemId: string): void {
  const history = getTimerHistory();
  const filtered = history.filter(h => h.id !== itemId);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function clearHistory(): void {
  const history = getTimerHistory();
  // Keep only favorites
  const favorites = history.filter(item => item.isFavorite);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(favorites));
}

export function getFavorites(): TimerHistoryItem[] {
  return getTimerHistory().filter(item => item.isFavorite);
}

export function getRecentTimers(limit: number = 10): TimerHistoryItem[] {
  return getTimerHistory()
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, limit);
}

export function getMostUsedTimers(limit: number = 10): TimerHistoryItem[] {
  return getTimerHistory()
    .sort((a, b) => b.useCount - a.useCount)
    .slice(0, limit);
}
