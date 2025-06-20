/**
 * Formats a number into a currency string (USD by default).
 * @param amount - The number to format.
 * @param currency - The currency code (e.g., 'USD', 'MXN').
 * @returns A formatted currency string.
 */
export function formatCurrency(amount: number | undefined | null, currency = 'USD'): string {
  if (amount === undefined || amount === null) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Formats a number into a percentage string.
 * @param rate - The number to format (e.g., 0.05 for 5%).
 * @returns A formatted percentage string.
 */
export function formatPercent(rate: number | undefined | null): string {
  if (rate === undefined || rate === null) {
    return '0.00%';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);
} 