import { ShopcoreConfig } from '../types/config';

/**
 * Default Shopcore configuration
 * 
 * These defaults are used when specific values are not provided in the user's configuration.
 */
export const defaultConfig: Partial<ShopcoreConfig> = {
  // Core settings
  mode: 'development',
  debug: false,

  // Feature flags
  enableCart: true,
  enableWishlist: false,
  enableCheckout: true,
  enableReviews: false,
  enableUpselling: false,

  // Currency settings (these must be provided by the user)
  // defaultCurrency: 'USD', // Required
  // supportedCurrencies: ['USD'], // Required
  currencyFormat: 'locale',
  // fallbackCurrency: undefined, // Optional

  // Localization settings (defaultLocale must be provided by the user)
  // defaultLocale: 'en-US', // Required
  // supportedLocales: undefined, // Optional
  // translations: undefined, // Optional
  enableTranslations: true,

  // Theme settings
  theme: {
    colorScheme: 'system',
    primaryColor: '#0070f3',
    radius: 4,
  },

  // Performance settings
  enableLazyLoading: true,
  enableSSR: true,
  cacheStrategy: 'memory',
  cacheSettings: {
    maxEntries: 1000,
    expirationTime: 3600000, // 1 hour in milliseconds
  },

  // Mock system
  mock: {
    enabled: false,
  },
};

/**
 * Required configuration fields that must be provided by the user
 */
export const requiredConfigFields: Array<keyof ShopcoreConfig> = [
  'mode',
  'defaultCurrency',
  'supportedCurrencies',
  'defaultLocale',
];

/**
 * Validates the provided configuration and ensures all required fields are present
 * 
 * @param config The user-provided configuration
 * @returns The validated configuration with defaults applied
 * @throws Error if required fields are missing
 */
export function validateConfig(config: Partial<ShopcoreConfig>): ShopcoreConfig {
  // Check for required fields
  for (const field of requiredConfigFields) {
    if (config[field] === undefined) {
      throw new Error(`Missing required configuration field: ${field}`);
    }
  }

  // Merge with defaults
  return {
    ...defaultConfig,
    ...config,
    // Deep merge for nested objects
    theme: {
      ...defaultConfig.theme,
      ...config.theme,
    },
    cacheSettings: {
      ...defaultConfig.cacheSettings,
      ...config.cacheSettings,
    },
    mock: {
      ...defaultConfig.mock,
      ...config.mock,
    },
  } as ShopcoreConfig;
} 