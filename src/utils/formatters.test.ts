import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('should format a positive number correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format a number with no decimal part', () => {
    expect(formatCurrency(500)).toBe('$500.00');
  });

  it('should handle large numbers with commas', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });

  it('should format a negative number correctly', () => {
    // The default style is 'currency', which often represents negative numbers with parentheses.
    // This depends on the locale, but for 'en-US' it's common.
    // Let's test for the presence of the number and negative sign representation.
    const formatted = formatCurrency(-1234.56);
    expect(formatted).toMatch(/-\$1,234.56|\(\$1,234.56\)/);
  });
}); 