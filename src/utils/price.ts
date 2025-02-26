/**
 * Price formatting utilities
 */

/**
 * Options for formatting a price
 */
export interface PriceFormatOptions {
  /**
   * Currency code (e.g., USD, EUR)
   */
  currency: string;

  /**
   * Locale for formatting (e.g., en-US, fr-FR)
   */
  locale: string;

  /**
   * Format type
   * - "locale": Use the locale's default currency formatting
   * - "custom": Use a custom format
   */
  format?: 'locale' | 'custom';

  /**
   * Custom format options (only used when format is "custom")
   */
  customFormat?: {
    /**
     * Symbol to use for the currency (e.g., $, €)
     */
    symbol?: string;

    /**
     * Position of the currency symbol
     * - "before": Before the amount (e.g., $10)
     * - "after": After the amount (e.g., 10€)
     */
    symbolPosition?: 'before' | 'after';

    /**
     * Decimal separator (e.g., ., ,)
     */
    decimalSeparator?: string;

    /**
     * Thousands separator (e.g., ,, .)
     */
    thousandsSeparator?: string;

    /**
     * Number of decimal places
     */
    decimalPlaces?: number;
  };
}

/**
 * Default price format options
 */
const defaultPriceFormatOptions: Partial<PriceFormatOptions> = {
  format: 'locale',
  customFormat: {
    symbolPosition: 'before',
    decimalPlaces: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
};

/**
 * Format a price according to the provided options
 *
 * @param amount The amount to format
 * @param options The formatting options
 * @returns The formatted price
 *
 * @example
 * ```ts
 * formatPrice(10.99, { currency: 'USD', locale: 'en-US' }); // "$10.99"
 * formatPrice(10.99, { currency: 'EUR', locale: 'fr-FR' }); // "10,99 €"
 * ```
 */
export function formatPrice(amount: number, options: PriceFormatOptions): string {
  const { currency, locale, format, customFormat } = {
    ...defaultPriceFormatOptions,
    ...options,
    customFormat: {
      ...defaultPriceFormatOptions.customFormat,
      ...options.customFormat,
    },
  };

  // Use locale-based formatting
  if (format === 'locale') {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.error(`Error formatting price with locale ${locale} and currency ${currency}:`, error);
      // Fall back to custom formatting if locale formatting fails
    }
  }

  // Use custom formatting
  const { symbol, symbolPosition, decimalSeparator, thousandsSeparator, decimalPlaces } = {
    ...defaultPriceFormatOptions.customFormat,
    ...customFormat,
    // Get currency symbol from the currency code if not provided
    symbol: customFormat?.symbol || getCurrencySymbol(currency, locale),
  };

  // Format the number
  const parts = amount.toFixed(decimalPlaces || 2).split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1] || '';

  // Add thousands separator
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator || ',');

  // Combine integer and decimal parts
  const formattedAmount = decimalPart
    ? `${formattedIntegerPart}${decimalSeparator || '.'}${decimalPart}`
    : formattedIntegerPart;

  // Add currency symbol
  return symbolPosition === 'before' ? `${symbol}${formattedAmount}` : `${formattedAmount}${symbol}`;
}

/**
 * Get the currency symbol for a given currency code and locale
 *
 * @param currency The currency code
 * @param locale The locale
 * @returns The currency symbol
 */
function getCurrencySymbol(currency: string, locale: string): string {
  try {
    // Use a dummy value to get the currency symbol
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);

    // Extract the symbol (this is a simplistic approach and may not work for all currencies)
    const symbol = formatted.replace(/[\d\s,.]/g, '');
    return symbol;
  } catch (error) {
    console.error(`Error getting currency symbol for ${currency} and locale ${locale}:`, error);
    return currency; // Fall back to the currency code
  }
}

/**
 * Calculate the discount percentage between the original price and the sale price
 *
 * @param originalPrice The original price
 * @param salePrice The sale price
 * @returns The discount percentage (0-100)
 *
 * @example
 * ```ts
 * calculateDiscountPercentage(100, 75); // 25
 * ```
 */
export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) {
    return 0;
  }

  const discount = originalPrice - salePrice;
  const percentage = (discount / originalPrice) * 100;

  // Round to 1 decimal place
  return Math.round(percentage * 10) / 10;
}
