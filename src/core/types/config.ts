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

  /**
   * Color palette for the application
   */
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    error?: string;
    success?: string;
    warning?: string;
    info?: string;
    [key: string]: string | undefined;
  };

  /**
   * Font families for different text elements
   */
  fonts?: {
    body?: string;
    heading?: string;
    monospace?: string;
    [key: string]: string | undefined;
  };

  /**
   * Border radius values for different UI elements
   */
  borderRadius?: {
    small?: string;
    medium?: string;
    large?: string;
    full?: string;
    [key: string]: string | undefined;
  };

  /**
   * Spacing values for margins, paddings, and gaps
   */
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
    [key: string]: string | undefined;
  };

  /**
   * Responsive breakpoints for media queries
   */
  breakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
    [key: string]: string | undefined;
  };
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
  /** Enable mock data */
  enabled?: boolean;
  /** Delay in milliseconds for mock data */
  delay?: number;
  /** Data generators for mock data */
  generators?: {
    /** Generate mock products */
    products?: () => Product[];
    /** Generate mock cart items */
    cart?: () => CartItem[];
    /** Generate mock user */
    user?: () => User;
    /** Generate mock orders */
    orders?: () => Order[];
  };
  /** Static mock data */
  data?: {
    /** Mock products */
    products?: Product[];
    /** Mock cart items */
    cart?: CartItem[];
    /** Mock user */
    user?: User;
    /** Mock orders */
    orders?: Order[];
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
   * Shopcore version
   */
  version?: string;

  /**
   * API configuration
   */
  api?: {
    /**
     * Base URL for API requests
     */
    baseUrl: string;

    /**
     * API endpoints
     */
    endpoints: {
      products: string;
      cart?: string;
      checkout?: string;
      orders?: string;
      users?: string;
      auth?: string;
      [key: string]: string | undefined;
    };

    /**
     * Default headers for API requests
     */
    headers?: Record<string, string>;
  };

  /**
   * Currency configuration
   */
  currency?: {
    /**
     * Currency code (e.g., USD, EUR)
     */
    code: string;

    /**
     * Currency symbol (e.g., $, €)
     */
    symbol: string;

    /**
     * Position of the currency symbol
     */
    position: 'before' | 'after';

    /**
     * Number of decimal places
     */
    decimalPlaces: number;

    /**
     * Thousands separator character
     */
    thousandsSeparator: string;

    /**
     * Decimal separator character
     */
    decimalSeparator: string;
  };

  /**
   * Cache configuration
   */
  cache?: {
    /**
     * Whether caching is enabled
     */
    enabled: boolean;

    /**
     * Time to live in seconds
     */
    ttl: number;

    /**
     * Storage mechanism
     */
    storage: 'localStorage' | 'sessionStorage' | 'memory';
  };

  /**
   * Internationalization configuration
   */
  i18n?: {
    /**
     * Default locale
     */
    defaultLocale: string;

    /**
     * Supported locales
     */
    supportedLocales: string[];

    /**
     * Fallback locale
     */
    fallbackLocale: string;
  };

  /**
   * Feature configurations
   */
  features?: {
    /**
     * Cart feature configuration
     */
    cart?: {
      /**
       * Whether the cart feature is enabled
       */
      enabled: boolean;

      /**
       * Whether to persist the cart between sessions
       */
      persistCart?: boolean;

      /**
       * Whether to show taxes in the cart
       */
      showTaxes?: boolean;

      /**
       * Whether to show shipping costs in the cart
       */
      showShipping?: boolean;
    };

    /**
     * Wishlist feature configuration
     */
    wishlist?: {
      /**
       * Whether the wishlist feature is enabled
       */
      enabled: boolean;

      /**
       * Whether to persist the wishlist between sessions
       */
      persistWishlist?: boolean;
    };

    /**
     * Reviews feature configuration
     */
    reviews?: {
      /**
       * Whether the reviews feature is enabled
       */
      enabled: boolean;

      /**
       * Whether to allow anonymous reviews
       */
      allowAnonymous?: boolean;

      /**
       * Whether reviews require approval before being published
       */
      requireApproval?: boolean;
    };

    /**
     * Search feature configuration
     */
    search?: {
      /**
       * Whether the search feature is enabled
       */
      enabled: boolean;

      /**
       * Minimum query length for search
       */
      minQueryLength?: number;

      /**
       * Fields to search in
       */
      searchFields?: Array<'name' | 'description' | 'sku' | 'tags'>;
    };

    /**
     * Authentication feature configuration
     */
    auth?: {
      /**
       * Whether the authentication feature is enabled
       */
      enabled: boolean;

      /**
       * Whether to require email verification
       */
      requireEmailVerification?: boolean;

      /**
       * Whether to allow guest checkout
       */
      allowGuestCheckout?: boolean;

      /**
       * Authentication providers
       */
      providers?: string[];
    };
  };

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
