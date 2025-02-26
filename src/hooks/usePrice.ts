import { useMemo } from 'react';
import { useShopcoreConfig } from '../core/context/ShopcoreContext';
import { calculateDiscountPercentage, formatPrice, PriceFormatOptions } from '../utils/price';

/**
 * Options for the usePrice hook
 */
export interface UsePriceOptions {
  /**
   * The amount to format
   */
  amount: number;

  /**
   * The currency to use (overrides the default currency from the config)
   */
  currency?: string;

  /**
   * The locale to use (overrides the default locale from the config)
   */
  locale?: string;

  /**
   * The original price (for calculating discounts)
   */
  baseAmount?: number;

  /**
   * Custom format options
   */
  customFormat?: PriceFormatOptions['customFormat'];
}

/**
 * Result of the usePrice hook
 */
export interface UsePriceResult {
  /**
   * The formatted price
   */
  formattedPrice: string;

  /**
   * The formatted base price (if provided)
   */
  formattedBasePrice?: string;

  /**
   * The discount percentage (if baseAmount is provided)
   */
  discountPercentage?: number;

  /**
   * Whether the price has a discount
   */
  hasDiscount: boolean;
}

/**
 * Hook for formatting prices according to the Shopcore configuration
 * 
 * @param options The price options
 * @returns The formatted price and related information
 * 
 * @example
 * ```tsx
 * const { formattedPrice, hasDiscount, discountPercentage } = usePrice({
 *   amount: 75,
 *   baseAmount: 100,
 * });
 * 
 * // Renders: <div>$75.00 <span>25% off</span></div>
 * return (
 *   <div>
 *     {formattedPrice}
 *     {hasDiscount && <span>{discountPercentage}% off</span>}
 *   </div>
 * );
 * ```
 */
export function usePrice(options: UsePriceOptions): UsePriceResult {
  const { amount, baseAmount, currency: currencyProp, locale: localeProp, customFormat } = options;
  const config = useShopcoreConfig();

  // Get currency and locale from config or props
  const currency = currencyProp || config.defaultCurrency;
  const locale = localeProp || config.defaultLocale;

  return useMemo(() => {
    // Format options based on config and props
    const formatOptions: PriceFormatOptions = {
      currency,
      locale,
      format: config.currencyFormat,
      customFormat,
    };

    // Format the price
    const formattedPrice = formatPrice(amount, formatOptions);

    // Format the base price if provided
    const formattedBasePrice = baseAmount
      ? formatPrice(baseAmount, formatOptions)
      : undefined;

    // Calculate discount percentage if base amount is provided
    const discountPercentage = baseAmount && baseAmount > amount
      ? calculateDiscountPercentage(baseAmount, amount)
      : undefined;

    return {
      formattedPrice,
      formattedBasePrice,
      discountPercentage,
      hasDiscount: Boolean(discountPercentage && discountPercentage > 0),
    };
  }, [amount, baseAmount, currency, locale, config.currencyFormat, customFormat]);
} 