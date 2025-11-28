import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatGold(grams: number): string {
  return `${grams.toFixed(4)} gr`
}

export function isBusinessHours(): boolean {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 6 = Saturday
  const hour = now.getHours()
  const minute = now.getMinutes()
  const timeInMinutes = hour * 60 + minute

  // Monday to Saturday (1-6), 09:00-15:00
  if (day >= 1 && day <= 6) {
    const startTime = 9 * 60 // 09:00
    const endTime = 15 * 60 // 15:00
    return timeInMinutes >= startTime && timeInMinutes < endTime
  }

  return false
}
