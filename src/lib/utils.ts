import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine conditional class names and merge conflicting Tailwind utilities so
 * the last one wins, e.g. `cn("bg-gray-900", isWinning && "bg-green-900")`.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
