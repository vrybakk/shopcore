import { mockProducts } from './mock/products';
import { ShopcoreConfig } from './types/config';

/**
 * Default configuration for Shopcore
 */
export const defaultConfig: ShopcoreConfig = {
  version: '0.1.0',
  debug: false,
  api: {
    baseUrl: 'https://api.example.com',
    endpoints: {
      products: '/products',
      cart: '/cart',
      checkout: '/checkout',
      orders: '/orders',
      users: '/users',
      auth: '/auth',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  },
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#1e293b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#0f172a',
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
    fonts: {
      body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      monospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    borderRadius: {
      small: '0.25rem',
      medium: '0.5rem',
      large: '1rem',
      full: '9999px',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
  },
  currency: {
    code: 'USD',
    symbol: '$',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour in seconds
    storage: 'localStorage',
  },
  mock: {
    enabled: true,
    fallbackOnError: true,
    data: {
      products: mockProducts,
    },
  },
  i18n: {
    defaultLocale: 'en-US',
    supportedLocales: ['en-US', 'es-ES', 'fr-FR', 'de-DE'],
    fallbackLocale: 'en-US',
  },
  features: {
    cart: {
      enabled: true,
      persistCart: true,
      showTaxes: true,
      showShipping: true,
    },
    wishlist: {
      enabled: true,
      persistWishlist: true,
    },
    reviews: {
      enabled: true,
      allowAnonymous: false,
      requireApproval: true,
    },
    search: {
      enabled: true,
      minQueryLength: 2,
      searchFields: ['name', 'description', 'sku', 'tags'],
    },
    auth: {
      enabled: true,
      requireEmailVerification: true,
      allowGuestCheckout: true,
      providers: ['email', 'google', 'facebook'],
    },
  },
};
