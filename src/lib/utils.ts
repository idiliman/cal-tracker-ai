import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function extractNumber(value: string | undefined) {
  const match = value?.match(/(\d+)/);
  return match ? Number(match[0]) : 0;
}
