import React, { createContext, ReactNode, useContext } from 'react';
import { validateConfig } from '../config/defaults';
import { ShopcoreConfig } from '../types/config';

/**
 * Shopcore context interface
 */
interface ShopcoreContextValue {
  /**
   * The validated Shopcore configuration
   */
  config: ShopcoreConfig;
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
export function ShopcoreProvider({ config: userConfig, children }: ShopcoreProviderProps) {
  // Validate and merge with defaults
  const config = React.useMemo(() => {
    try {
      return validateConfig(userConfig);
    } catch (error) {
      // Handle configuration errors
      if (userConfig.onError) {
        userConfig.onError(error);
      }
      console.error('Shopcore configuration error:', error);
      throw error;
    }
  }, [userConfig]);

  // Create the context value
  const contextValue = React.useMemo(() => {
    return { config };
  }, [config]);

  // Debug logging
  React.useEffect(() => {
    if (config.debug) {
      console.log('Shopcore initialized with config:', config);
    }
  }, [config]);

  return (
    <ShopcoreContext.Provider value={contextValue}>
      {children}
    </ShopcoreContext.Provider>
  );
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