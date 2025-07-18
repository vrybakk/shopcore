'use client';

import React, { createContext, useContext } from 'react';
import { createLogger } from '../../utils/logger';
import { CartItem, CartState } from '../cart/types';
import { PluginManager } from '../plugins/manager';
import { ComponentName, ShopcorePlugin } from '../plugins/types';
import { ProvidersComposer } from '../providers';
import { defaultTheme, Theme } from '../theme/theme';

// Create a logger instance
const logger = createLogger({ debug: true, mode: 'development' });

/**
 * Storage type options
 */
export const STORAGE_TYPES = ['none', 'localStorage', 'sessionStorage'] as const;
export type StorageType = (typeof STORAGE_TYPES)[number];

/**
 * Storage configuration
 */
export type StorageConfig = {
  type: StorageType;
  key?: string;
};

/**
 * Cart behavior configuration
 */
export type CartBehaviorConfig = {
  maxQuantityPerItem?: number;
  minQuantityPerItem?: number;
  allowNegativeStock?: boolean;
  mergeSameItems?: boolean;
};

/**
 * Cart pricing configuration
 */
export type CartPricingConfig = {
  calculateTotals?: (items: CartItem<any>[]) => CartState<any>['totals'];
  shouldIncludeTax?: boolean;
  taxRate?: number;
};

/**
 * Cart configuration
 */
export type CartConfig = {
  storage?: StorageConfig;
  behavior?: CartBehaviorConfig;
  pricing?: CartPricingConfig;
};

/**
 * Mock data configuration
 */
export type MockConfig = {
  enabled?: boolean;
  delay?: number;
  data?: {
    products?: any[];
  };
};

/**
 * Shopcore configuration options
 */
export interface ShopcoreConfig {
  /** Mode of operation (development or production) */
  mode?: 'development' | 'production';
  /** Enable debug mode */
  debug?: boolean;
  /** Default currency */
  defaultCurrency?: string;
  /** Supported currencies */
  supportedCurrencies?: string[];
  /** Default locale */
  defaultLocale?: string;
  /** Supported locales */
  supportedLocales?: string[];
  /** Feature flags */
  features?: {
    cart?: boolean;
    wishlist?: boolean;
    checkout?: boolean;
  };
  /** Mock data configuration */
  mock?: MockConfig;
  /** Theme configuration */
  theme?: Partial<Theme>;
  /** Cart configuration */
  cart?: CartConfig;
}

/**
 * Shopcore context value
 */
export interface ShopcoreContextValue {
  /** Shopcore configuration */
  config: ShopcoreConfig;
  /** Theme configuration */
  theme: Theme;
  /** Plugin manager instance */
  pluginManager: PluginManager;
  /** Apply plugin hooks to modify a product */
  modifyProduct: <T>(product: T) => T;
  /** Apply plugin hooks to modify an array of products */
  modifyProducts: <T>(products: T[]) => T[];
  /** Apply plugin hooks to modify cart data */
  modifyCart: <T>(cart: T) => T;
  /** Apply plugin hooks to modify cart item data */
  modifyCartItem: <T>(cartItem: T) => T;
  /** Apply plugin hooks to render content before a component */
  applyBeforeRenderHooks: (componentName: ComponentName, props: any) => React.ReactNode[];
  /** Apply plugin hooks to render content after a component */
  applyAfterRenderHooks: (componentName: ComponentName, props: any) => React.ReactNode[];
  /** Apply plugin hooks to replace a component */
  applyReplaceComponentHook: (
    componentName: ComponentName,
    DefaultComponent: React.ComponentType<any>,
    props: any
  ) => React.ReactNode | null;
  /** Apply plugin hooks before making a fetch request */
  applyBeforeFetchHook: (url: string, options: RequestInit) => { url: string; options: RequestInit };
  /** Apply plugin hooks after receiving a fetch response */
  applyAfterFetchHook: <T>(response: T) => T;
  /** Apply plugin hooks to handle fetch errors */
  applyFetchErrorHook: (error: Error) => boolean;
}

// Create the context with a default value
const ShopcoreContext = createContext<ShopcoreContextValue | null>(null);

/**
 * Props for the ShopcoreProvider component
 */
export interface ShopcoreProviderProps {
  /** Shopcore configuration */
  config?: Partial<ShopcoreConfig>;
  /** Theme configuration */
  theme?: Partial<Theme>;
  /** Plugins to register */
  plugins?: ShopcorePlugin[];
  /** Whether to automatically import styles */
  autoImportStyles?: boolean;
  /** Children components */
  children: React.ReactNode;
}

/**
 * Default Shopcore configuration
 */
const defaultConfig: ShopcoreConfig = {
  mode: 'production',
  debug: false,
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD'],
  defaultLocale: 'en-US',
  supportedLocales: ['en-US'],
  features: {
    cart: true,
    wishlist: false,
    checkout: true,
  },
  mock: {
    enabled: false,
    delay: 0,
  },
  cart: {
    storage: {
      type: 'localStorage',
      key: 'shopcore_cart',
    },
  },
};

/**
 * Provider component for Shopcore
 *
 * Using a simplified class component for maximum compatibility with all React versions
 * including React 19
 */
export class ShopcoreProviderClass extends React.Component<ShopcoreProviderProps> {
  pluginManager: PluginManager;
  config: ShopcoreConfig;
  theme: Theme;

  constructor(props: ShopcoreProviderProps) {
    super(props);
    this.pluginManager = new PluginManager();

    // Validate and normalize storage type
    const storageType = props.config?.cart?.storage?.type;
    const normalizedStorageType = this.normalizeStorageType(storageType);

    // Merge provided config with default config, ensuring type safety
    const mergedCart: CartConfig = {
      ...defaultConfig.cart,
      ...props.config?.cart,
      storage: {
        type: normalizedStorageType,
        key: props.config?.cart?.storage?.key ?? defaultConfig.cart?.storage?.key,
      },
    };

    this.config = {
      ...defaultConfig,
      ...(props.config || {}),
      features: {
        ...defaultConfig.features,
        ...props.config?.features,
      },
      cart: mergedCart,
    };

    // Merge provided theme with default theme
    this.theme = { ...defaultTheme, ...(props.theme || {}) };
  }

  /**
   * Normalizes storage type to ensure it's valid
   */
  private normalizeStorageType(type: unknown): StorageType {
    if (typeof type === 'string' && STORAGE_TYPES.includes(type as StorageType)) {
      return type as StorageType;
    }
    return defaultConfig.cart?.storage?.type ?? 'localStorage';
  }

  componentDidMount() {
    const plugins = this.props.plugins || [];
    const autoImportStyles = this.props.autoImportStyles || false;

    // Clear existing plugins
    this.pluginManager.getAllPlugins().forEach((plugin) => {
      this.pluginManager.unregister(plugin.id);
    });

    // Register new plugins
    plugins.forEach((plugin: ShopcorePlugin) => {
      this.pluginManager.register(plugin);
    });

    // Initialize plugin manager
    this.pluginManager.initialize(this.config, this.theme);

    // Import styles if enabled
    if (autoImportStyles) {
      // Import styles logic here
      console.log('Auto-importing styles...');
    }
  }

  componentDidUpdate(prevProps: ShopcoreProviderProps) {
    const plugins = this.props.plugins || [];
    const config = this.props.config || {};
    const theme = this.props.theme || {};
    const autoImportStyles = this.props.autoImportStyles || false;

    // Check if plugins, config, or theme have changed
    if (
      plugins !== prevProps.plugins ||
      JSON.stringify(config) !== JSON.stringify(prevProps.config || {}) ||
      JSON.stringify(theme) !== JSON.stringify(prevProps.theme || {})
    ) {
      // Validate and normalize storage type
      const storageType = config.cart?.storage?.type;
      const normalizedStorageType = this.normalizeStorageType(storageType);

      // Update config and theme
      const mergedCart: CartConfig = {
        ...defaultConfig.cart,
        ...config.cart,
        storage: {
          type: normalizedStorageType,
          key: config.cart?.storage?.key ?? defaultConfig.cart?.storage?.key,
        },
      };

      this.config = {
        ...defaultConfig,
        ...config,
        features: {
          ...defaultConfig.features,
          ...config.features,
        },
        cart: mergedCart,
      };
      this.theme = { ...defaultTheme, ...theme };

      // Clear existing plugins
      this.pluginManager.getAllPlugins().forEach((plugin) => {
        this.pluginManager.unregister(plugin.id);
      });

      // Register new plugins
      plugins.forEach((plugin: ShopcorePlugin) => {
        this.pluginManager.register(plugin);
      });

      // Initialize plugin manager
      this.pluginManager.initialize(this.config, this.theme);
    }

    // Check if autoImportStyles has changed
    if (autoImportStyles !== prevProps.autoImportStyles && autoImportStyles) {
      // Import styles logic here
      console.log('Auto-importing styles...');
    }
  }

  componentWillUnmount() {
    const plugins = this.props.plugins || [];

    // Cleanup plugins
    plugins.forEach((plugin: ShopcorePlugin) => {
      if (plugin.id) {
        this.pluginManager.unregister(plugin.id);
      }
    });
  }

  render() {
    // Create context value with plugin manager methods
    const contextValue: ShopcoreContextValue = {
      config: this.config,
      theme: this.theme,
      pluginManager: this.pluginManager,
      modifyProduct: <T,>(product: T) => this.pluginManager.applyProductHook(product),
      modifyProducts: <T,>(products: T[]) => this.pluginManager.applyProductsHook(products),
      modifyCart: <T,>(cart: T) => this.pluginManager.applyCartHook(cart),
      modifyCartItem: <T,>(cartItem: T) => this.pluginManager.applyCartItemHook(cartItem),
      applyBeforeRenderHooks: (componentName: ComponentName, props: any) =>
        this.pluginManager.applyBeforeRenderHooks(componentName, props),
      applyAfterRenderHooks: (componentName: ComponentName, props: any) =>
        this.pluginManager.applyAfterRenderHooks(componentName, props),
      applyReplaceComponentHook: (
        componentName: ComponentName,
        DefaultComponent: React.ComponentType<any>,
        props: any
      ) => this.pluginManager.applyReplaceComponentHook(componentName, DefaultComponent, props),
      applyBeforeFetchHook: (url: string, options: RequestInit) =>
        this.pluginManager.applyBeforeFetchHook(url, options),
      applyAfterFetchHook: <T,>(response: T) => this.pluginManager.applyAfterFetchHook(response),
      applyFetchErrorHook: (error: Error) => this.pluginManager.applyFetchErrorHook(error),
    };

    return (
      <ShopcoreContext.Provider value={contextValue}>
        <ProvidersComposer config={this.config}>{this.props.children}</ProvidersComposer>
      </ShopcoreContext.Provider>
    );
  }
}

// Export the provider with proper typing for external use
export const ShopcoreProvider = ShopcoreProviderClass;

/**
 * Runtime configuration validator
 */
export class ConfigValidator {
  static validateStorageType(type: unknown): StorageType {
    if (typeof type === 'string' && STORAGE_TYPES.includes(type as StorageType)) {
      return type as StorageType;
    }
    return 'localStorage';
  }
}

/**
 * Configuration builder with improved DX
 */
export const createShopcoreConfig = (config: {
  [K in keyof ShopcoreConfig]: K extends 'cart'
    ? {
        storage?: { type: string; key?: string };
        behavior?: CartBehaviorConfig;
        pricing?: CartPricingConfig;
      }
    : ShopcoreConfig[K];
}): ShopcoreConfig => {
  // Validate and normalize cart storage if present
  if (config.cart?.storage) {
    config.cart.storage = {
      ...config.cart.storage,
      type: ConfigValidator.validateStorageType(config.cart.storage.type),
    };
  }

  return config as ShopcoreConfig;
};

/**
 * Hook to access the Shopcore context
 * @returns The Shopcore context value
 * @throws Error if used outside of a ShopcoreProvider
 */
export const useShopcore = (): ShopcoreContextValue => {
  const context = useContext(ShopcoreContext);

  if (!context) {
    throw new Error('useShopcore must be used within a ShopcoreProvider');
  }

  return context;
};

/**
 * Hook to access the Shopcore configuration
 * @returns The Shopcore configuration
 */
export const useShopcoreConfig = (): ShopcoreConfig => {
  return useShopcore().config;
};

/**
 * Hook to access the Shopcore theme
 * @returns The Shopcore theme
 */
export const useShopcoreTheme = (): Theme => {
  return useShopcore().theme;
};

/**
 * Hook to apply plugin hooks to modify a product
 * @param product The product to modify
 * @returns The modified product
 */
export const useModifiedProduct = <T,>(product: T): T => {
  return useShopcore().modifyProduct(product);
};

/**
 * Hook to apply plugin hooks to modify an array of products
 * @param products The products to modify
 * @returns The modified products
 */
export const useModifiedProducts = <T,>(products: T[]): T[] => {
  return useShopcore().modifyProducts(products);
};

/**
 * Hook to apply plugin hooks to modify cart data
 * @param cart The cart to modify
 * @returns The modified cart
 */
export const useModifiedCart = <T,>(cart: T): T => {
  return useShopcore().modifyCart(cart);
};

/**
 * Hook to apply plugin hooks to modify cart item data
 * @param cartItem The cart item to modify
 * @returns The modified cart item
 */
export const useModifiedCartItem = <T,>(cartItem: T): T => {
  return useShopcore().modifyCartItem(cartItem);
};

/**
 * Hook to apply plugin hooks to render content before a component
 * @param componentName The name of the component
 * @param props The component props
 * @returns An array of elements to render before the component
 */
export const useBeforeRender = (componentName: ComponentName, props: any): React.ReactNode[] => {
  return useShopcore().applyBeforeRenderHooks(componentName, props);
};

/**
 * Hook to apply plugin hooks to render content after a component
 * @param componentName The name of the component
 * @param props The component props
 * @returns An array of elements to render after the component
 */
export const useAfterRender = (componentName: ComponentName, props: any): React.ReactNode[] => {
  return useShopcore().applyAfterRenderHooks(componentName, props);
};

/**
 * Hook to apply plugin hooks to replace a component
 * @param componentName The name of the component
 * @param DefaultComponent The default component
 * @param props The component props
 * @returns The replacement component, or null to use the default component
 */
export const useReplaceComponent = (
  componentName: ComponentName,
  DefaultComponent: React.ComponentType<any>,
  props: any
): React.ReactNode | null => {
  return useShopcore().applyReplaceComponentHook(componentName, DefaultComponent, props);
};

/**
 * Hook to apply plugin hooks before making a fetch request
 * @returns A function to transform the request URL and options
 */
export const useBeforeFetch = (): ((url: string, options: RequestInit) => { url: string; options: RequestInit }) => {
  const { applyBeforeFetchHook } = useShopcore();

  return React.useCallback(
    (url: string, options: RequestInit) => {
      return applyBeforeFetchHook(url, options);
    },
    [applyBeforeFetchHook]
  );
};

/**
 * Hook to apply plugin hooks after receiving a fetch response
 * @returns A function to transform the response
 */
export const useAfterFetch = (): (<T>(response: T) => T) => {
  const { applyAfterFetchHook } = useShopcore();

  return React.useCallback(
    <T,>(response: T) => {
      return applyAfterFetchHook(response);
    },
    [applyAfterFetchHook]
  );
};

/**
 * Hook to apply plugin hooks to handle fetch errors
 * @returns A function to handle fetch errors
 */
export const useFetchError = (): ((error: Error) => boolean) => {
  const { applyFetchErrorHook } = useShopcore();

  return React.useCallback(
    (error: Error) => {
      return applyFetchErrorHook(error);
    },
    [applyFetchErrorHook]
  );
};

/**
 * Higher-order component that applies plugin UI hooks to a component
 * @param componentName The name of the component
 * @param Component The component to wrap
 * @returns A wrapped component with plugin hooks applied
 */
export const withPluginHooks = <P extends object>(
  componentName: ComponentName,
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { applyBeforeRenderHooks, applyAfterRenderHooks, applyReplaceComponentHook } = useShopcore();

    // Check if the component should be replaced
    const replacement = applyReplaceComponentHook(componentName, Component, props);
    if (replacement) {
      return <>{replacement}</>;
    }

    // Render before hooks, component, and after hooks
    const beforeElements = applyBeforeRenderHooks(componentName, props);
    const afterElements = applyAfterRenderHooks(componentName, props);

    return (
      <>
        {beforeElements}
        <Component {...props} />
        {afterElements}
      </>
    );
  };

  WrappedComponent.displayName = `withPluginHooks(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};
