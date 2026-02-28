
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Ye function Tailwind classes ko smartly merge karta hai.
 * Agar koi conflicting classes hon (e.g., 'px-2' aur 'px-4'), 
 * toh ye hamesha latest wali ko rakhta hai.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Message ka time format karne ke liye helper (Optional)
 */
export function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}