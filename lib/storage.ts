import { ScanHistoryItem } from '../types';

const HISTORY_KEY = 'sortit_history';
const MAX_HISTORY = 20;

export function getHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: ScanHistoryItem): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    history.unshift(item);
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    console.error('Failed to save to history');
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getRegion(): string {
  if (typeof window === 'undefined') return 'Generic / Unknown';
  return localStorage.getItem('sortit_region') || 'Generic / Unknown';
}

export function setRegion(region: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sortit_region', region);
}
