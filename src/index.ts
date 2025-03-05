/**
 * Shopcore - An open-source e-commerce framework
 *
 * @packageDocumentation
 */

// Export types
export type {
  CacheSettings,
  CartItem,
  MockConfig,
  Order,
  ShopcoreConfig,
  ThemeConfig,
  User,
} from './core/types/config';

export type { Product, ProductImage, ProductReview, ProductVariant } from './core/types/product';

// Export theme types and utilities
export type {
  Theme,
  ThemeBorderRadius,
  ThemeBreakpoints,
  ThemeColors,
  ThemeFonts,
  ThemeSpacing,
} from './core/theme/theme';

export { defaultTheme, generateCssVariables, generateThemeStylesheet, mergeTheme } from './core/theme/theme';

// Export context and provider
export {
  ShopcoreProvider,
  useShopcore,
  useShopcoreConfig,
  useShopcoreTheme,
  type ShopcoreContextValue,
  type ShopcoreProviderProps,
} from './core/context/ShopcoreContext';

// Export configuration utilities
export { defaultConfig, validateConfig } from './core/config/defaults';

// Export utilities
export { createLogger, LogLevel, type LoggerConfig } from './utils/logger';

export { calculateDiscountPercentage, formatPrice, type PriceFormatOptions } from './utils/price';

export {
  calculateAverageRating,
  fetchProductById,
  fetchProducts,
  filterProducts,
  generateProductSlug,
  getRelatedProducts,
  getStockStatusText,
  isNewProduct,
  isProductOnSale,
  searchProducts,
  sortProducts,
  type ProductFetchOptions,
  type ProductFetchResult,
  type ProductFilterOptions,
  type ProductPaginationOptions,
  type ProductSearchOptions,
  type ProductSortOptions,
} from './utils/products';

// Export hooks
export { usePrice, type UsePriceOptions, type UsePriceResult } from './hooks/usePrice';

export { useProduct, useProducts } from './hooks/useProducts';

// Export components
export {
  ProductCard,
  ProductDetail,
  ProductGrid,
  type ProductCardProps,
  type ProductDetailProps,
  type ProductGridProps,
} from './components/product';

// Export plugin system
export {
  PluginProvider,
  useAfterFetch,
  useAfterRender,
  useBeforeFetch,
  useBeforeRender,
  useFetchError,
  useModifiedCart,
  useModifiedCartItem,
  useModifiedProduct,
  useModifiedProducts,
  usePluginManager,
  useReplaceComponent,
  withPluginHooks,
} from './core/plugins/hooks';
export type { PluginProviderProps } from './core/plugins/hooks';
export { PluginManager } from './core/plugins/manager';
export type { ShopcorePlugin } from './core/plugins/types';

// Export mock data
export { mockProducts } from './core/mock/products';

// Version information
export const VERSION = '0.1.0';

/**
 * CSS Styles
 *
 * The following CSS files are available in the dist/styles directory:
 * - base.css: Base styles and CSS variables
 * - product.css: Styles for product components
 *
 * Import them in your application:
 * ```
 * import 'shopcore/dist/styles/base.css';
 * import 'shopcore/dist/styles/product.css';
 * ```
 */

/**
 * Tailwind CSS Plugin
 *
 * Shopcore provides a Tailwind CSS plugin that adds theme colors and utilities.
 *
 * Import it in your tailwind.config.js:
 * ```js
 * const shopcorePlugin = require('shopcore/tailwind');
 *
 * module.exports = {
 *   // ... other Tailwind config
 *   plugins: [
 *     shopcorePlugin({
 *       // Override default colors
 *       colors: {
 *         primary: '#ff0000', // Override primary color
 *       },
 *     }),
 *   ],
 * };
 * ```
 */
