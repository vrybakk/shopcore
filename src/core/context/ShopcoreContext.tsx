import { createContext, ReactNode, useContext, useEffect } from 'react';
import { createLogger } from '../../utils/logger';
import { validateConfig } from '../config/defaults';
import { defaultTheme, generateCssVariables, mergeTheme, Theme } from '../theme/theme';
import { ShopcoreConfig } from '../types/config';

// Create a logger instance
const logger = createLogger({ debug: true, mode: 'development' });

/**
 * Shopcore context interface
 */
interface ShopcoreContextValue {
  /**
   * The validated Shopcore configuration
   */
  config: ShopcoreConfig;

  /**
   * The current theme
   */
  theme: Theme;
}

/**
 * Create the Shopcore context
 */
const ShopcoreContext = createContext<ShopcoreContextValue | undefined>(undefined);

/**
 * Props for the ShopcoreProvider component
 */
export interface ShopcoreProviderProps {
  /**
   * The Shopcore configuration
   */
  config: Partial<ShopcoreConfig>;

  /**
   * Children components
   */
  children: ReactNode;

  /**
   * Whether to automatically inject CSS styles
   * @default true
   */
  autoImportStyles?: boolean;

  /**
   * Custom theme
   */
  theme?: Partial<Theme>;
}

/**
 * Shopcore provider component
 *
 * Wraps the application with the Shopcore context, providing access to the configuration
 * and other Shopcore features.
 *
 * @example
 * ```tsx
 * <ShopcoreProvider config={config}>
 *   <App />
 * </ShopcoreProvider>
 * ```
 */
export function ShopcoreProvider({
  config: userConfig,
  children,
  autoImportStyles = true,
  theme: customTheme,
}: ShopcoreProviderProps) {
  // Validate the configuration
  const config = validateConfig(userConfig);

  // Merge the custom theme with the default theme
  const theme = customTheme ? mergeTheme(customTheme) : defaultTheme;

  // Auto-import CSS styles if enabled
  useEffect(() => {
    if (autoImportStyles) {
      // Import base styles
      const baseStylesLink = document.createElement('link');
      baseStylesLink.rel = 'stylesheet';
      baseStylesLink.href = 'shopcore/dist/styles/base.css';
      baseStylesLink.id = 'shopcore-base-styles';

      // Import product styles if product features are enabled
      if (config.enableCart || config.enableWishlist || config.enableUpselling) {
        const productStylesLink = document.createElement('link');
        productStylesLink.rel = 'stylesheet';
        productStylesLink.href = 'shopcore/dist/styles/product.css';
        productStylesLink.id = 'shopcore-product-styles';

        // Only add if not already present
        if (!document.getElementById('shopcore-product-styles')) {
          document.head.appendChild(productStylesLink);
        }
      }

      // Only add if not already present
      if (!document.getElementById('shopcore-base-styles')) {
        document.head.appendChild(baseStylesLink);
      }

      // Apply theme CSS variables
      const themeStyleElement = document.createElement('style');
      themeStyleElement.id = 'shopcore-theme-variables';
      themeStyleElement.textContent = `:root {\n${generateCssVariables(theme)}\n}`;

      // Replace existing theme variables or add new ones
      const existingThemeElement = document.getElementById('shopcore-theme-variables');
      if (existingThemeElement) {
        existingThemeElement.textContent = themeStyleElement.textContent;
      } else {
        document.head.appendChild(themeStyleElement);
      }
    }

    // Log configuration in development mode
    if (config.mode === 'development' && config.debug) {
      logger.debug('Shopcore initialized with configuration:', config);
      logger.debug('Theme:', theme);
    }

    // Cleanup function to remove styles when the provider is unmounted
    return () => {
      if (autoImportStyles) {
        const baseStyles = document.getElementById('shopcore-base-styles');
        const productStyles = document.getElementById('shopcore-product-styles');
        const themeVariables = document.getElementById('shopcore-theme-variables');

        if (baseStyles) baseStyles.remove();
        if (productStyles) productStyles.remove();
        if (themeVariables) themeVariables.remove();
      }
    };
  }, [autoImportStyles, config, theme]);

  // Create the context value
  const contextValue: ShopcoreContextValue = {
    config,
    theme,
  };

  return <ShopcoreContext.Provider value={contextValue}>{children}</ShopcoreContext.Provider>;
}

/**
 * Hook for accessing the Shopcore context
 *
 * @returns The Shopcore context value
 * @throws Error if used outside of a ShopcoreProvider
 *
 * @example
 * ```tsx
 * const { config } = useShopcoreContext();
 * console.log(config.defaultCurrency);
 * ```
 */
export function useShopcoreContext(): ShopcoreContextValue {
  const context = useContext(ShopcoreContext);

  if (context === undefined) {
    throw new Error('useShopcoreContext must be used within a ShopcoreProvider');
  }

  return context;
}

/**
 * Hook for accessing the Shopcore configuration
 *
 * @returns The Shopcore configuration
 * @throws Error if used outside of a ShopcoreProvider
 *
 * @example
 * ```tsx
 * const config = useShopcoreConfig();
 * console.log(config.defaultCurrency);
 * ```
 */
export function useShopcoreConfig(): ShopcoreConfig {
  const { config } = useShopcoreContext();
  return config;
}

/**
 * Hook to access the Shopcore theme
 *
 * @throws Error if used outside of a ShopcoreProvider
 * @returns The Shopcore theme
 *
 * @example
 * ```tsx
 * const theme = useShopcoreTheme();
 * ```
 */
export function useShopcoreTheme(): Theme {
  const { theme } = useShopcoreContext();
  return theme;
}
