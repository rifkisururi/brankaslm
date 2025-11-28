import { formatCurrency, formatGold } from "./utils"

/**
 * Calculate installment details
 */
export interface InstallmentCalculation {
  totalAmount: number
  dpAmount: number
  dpPercent: number
  principalAmount: number // Amount after DP
  adminFee: number
  margin: number
  marginPercent: number
  totalWithMargin: number
  monthlyPayment: number
  tenorMonths: number
}

export function calculateInstallment(
  totalAmount: number,
  dpPercent: number,
  tenorMonths: number,
  adminFee: number,
  yearlyMarginPercent: number
): InstallmentCalculation {
  // Calculate DP
  const dpAmount = (totalAmount * dpPercent) / 100
  const principalAmount = totalAmount - dpAmount

  // Calculate margin (flat rate for entire period)
  const yearlyMargin = (principalAmount * yearlyMarginPercent) / 100
  const totalMargin = (yearlyMargin * tenorMonths) / 12

  // Total amount to be paid in installments
  const totalWithMargin = principalAmount + totalMargin + adminFee

  // Monthly payment
  const monthlyPayment = totalWithMargin / tenorMonths

  return {
    totalAmount,
    dpAmount,
    dpPercent,
    principalAmount,
    adminFee,
    margin: totalMargin,
    marginPercent: yearlyMarginPercent,
    totalWithMargin,
    monthlyPayment,
    tenorMonths,
  }
}

/**
 * Generate installment payment schedule
 */
export interface PaymentSchedule {
  paymentNumber: number
  dueDate: Date
  amount: number
  principalAmount: number
  marginAmount: number
}

export function generatePaymentSchedule(
  startDate: Date,
  paymentDay: number, // Day of month (1-31)
  monthlyPayment: number,
  tenorMonths: number,
  principalAmount: number,
  totalMargin: number
): PaymentSchedule[] {
  const schedule: PaymentSchedule[] = []
  const principalPerMonth = principalAmount / tenorMonths
  const marginPerMonth = totalMargin / tenorMonths

  for (let i = 0; i < tenorMonths; i++) {
    const paymentDate = new Date(startDate)
    paymentDate.setMonth(paymentDate.getMonth() + i + 1)

    // Set to specified payment day
    paymentDate.setDate(Math.min(paymentDay, getDaysInMonth(paymentDate)))

    schedule.push({
      paymentNumber: i + 1,
      dueDate: paymentDate,
      amount: monthlyPayment,
      principalAmount: principalPerMonth,
      marginAmount: marginPerMonth,
    })
  }

  return schedule
}

/**
 * Calculate late fee
 */
export function calculateLateFee(
  dueDate: Date,
  lateFeePerDay: number
): number {
  const now = new Date()
  if (now <= dueDate) return 0

  const daysLate = Math.floor(
    (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysLate * lateFeePerDay
}

/**
 * Get number of days in a month
 */
function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

/**
 * Validate DP percentage
 */
export function validateDpPercent(
  dpPercent: number,
  minDpPercent: number,
  maxDpPercent: number
): boolean {
  return dpPercent >= minDpPercent && dpPercent <= maxDpPercent
}

/**
 * Validate tenor
 */
export function validateTenor(
  tenorMonths: number,
  minTenorMonths: number,
  maxTenorMonths: number
): boolean {
  return tenorMonths >= minTenorMonths && tenorMonths <= maxTenorMonths
}

/**
 * Format installment summary for display
 */
export function formatInstallmentSummary(calc: InstallmentCalculation): string {
  return `
Total Harga: ${formatCurrency(calc.totalAmount)}
DP (${calc.dpPercent}%): ${formatCurrency(calc.dpAmount)}
Biaya Admin: ${formatCurrency(calc.adminFee)}
Margin (${calc.marginPercent}%/tahun): ${formatCurrency(calc.margin)}
Total Cicilan: ${formatCurrency(calc.totalWithMargin)}
Cicilan per Bulan: ${formatCurrency(calc.monthlyPayment)}
Tenor: ${calc.tenorMonths} bulan
  `.trim()
}
