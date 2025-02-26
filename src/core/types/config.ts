/**
 * Shopcore Configuration Types
 *
 * This file contains all the type definitions for the Shopcore configuration.
 */

import { Product } from './product';

/**
 * Cart item interface (placeholder for now)
 */
export interface CartItem {
  productId: string;
  quantity: number;
  // Other cart item properties will be added later
}

/**
 * User interface (placeholder for now)
 */
export interface User {
  id: string;
  // Other user properties will be added later
}

/**
 * Order interface (placeholder for now)
 */
export interface Order {
  id: string;
  // Other order properties will be added later
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /**
   * Color scheme for UI components
   * - "light": Forces components to render in light mode
   * - "dark": Forces components to render in dark mode
   * - "system": Adapts to the user's OS or browser preference
   */
  colorScheme?: 'light' | 'dark' | 'system';

  /**
   * Primary color used for buttons, highlights, and other UI elements
   */
  primaryColor?: string;

  /**
   * Border radius for UI components (in pixels)
   */
  radius?: number;
}

/**
 * Cache settings configuration
 */
export interface CacheSettings {
  /**
   * Maximum number of entries in the cache
   */
  maxEntries?: number;

  /**
   * Cache expiration time in milliseconds
   */
  expirationTime?: number;
}

/**
 * Mock system configuration
 */
export interface MockConfig {
  /**
   * Whether the mock system is enabled
   */
  enabled: boolean;

  /**
   * Data generators for mock data
   */
  generators?: {
    /**
     * Generate mock products
     */
    products?: () => Product[];

    /**
     * Generate mock cart items
     */
    cart?: () => CartItem[];

    /**
     * Generate mock user
     */
    user?: () => User;

    /**
     * Generate mock orders
     */
    orders?: () => Order[];
  };

  /**
   * Scenario generators for testing specific cases
   */
  scenarios?: {
    /**
     * Simulate out of stock scenario
     */
    outOfStock?: () => void;

    /**
     * Simulate price change for a product
     */
    priceChange?: (product: Product) => void;

    /**
     * Simulate payment error
     */
    paymentError?: () => void;

    /**
     * Simulate network latency
     */
    networkLatency?: (ms: number) => void;
  };
}

/**
 * Main Shopcore configuration interface
 */
export interface ShopcoreConfig {
  /**
   * Environment mode
   * - "development": Enables development-specific behaviors
   * - "production": Optimizes for production use
   */
  mode: 'development' | 'production';

  /**
   * Enable debug mode for additional logging
   */
  debug?: boolean;

  /**
   * Feature flags
   */
  enableCart?: boolean;
  enableWishlist?: boolean;
  enableCheckout?: boolean;
  enableReviews?: boolean;
  enableUpselling?: boolean;

  /**
   * Currency settings
   */
  defaultCurrency: string;
  supportedCurrencies: string[];
  currencyFormat?: 'locale' | 'custom';
  fallbackCurrency?: string;

  /**
   * Localization settings
   */
  defaultLocale: string;
  supportedLocales?: string[];
  translations?: Record<string, Record<string, string>>;
  enableTranslations?: boolean;

  /**
   * Theme configuration
   */
  theme?: ThemeConfig;

  /**
   * Performance settings
   */
  enableLazyLoading?: boolean;
  enableSSR?: boolean;
  cacheStrategy?: 'memory' | 'persistent';
  cacheSettings?: CacheSettings;

  /**
   * Error handling
   */
  onError?: (error: any) => void;

  /**
   * Mock system configuration
   */
  mock?: MockConfig;
}
