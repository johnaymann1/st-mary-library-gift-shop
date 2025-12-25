import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts
 * 
 * @param inputs - Array of class values (strings, objects, arrays)
 * @returns Merged className string with no conflicts
 * 
 * @example
 * cn('px-4 py-2', 'bg-red-500', { 'text-white': true })
 * cn('p-4', condition && 'mt-2')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
