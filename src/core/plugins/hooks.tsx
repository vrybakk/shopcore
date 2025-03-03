/**
 * Shopcore Plugin Hooks
 *
 * This file contains React hooks for using the plugin system in components.
 */

import React, { createContext, useCallback, useContext } from 'react';
import { PluginManager } from './manager';

// Create a context for the plugin manager
const PluginContext = createContext<PluginManager | null>(null);

/**
 * Props for the PluginProvider component
 */
export interface PluginProviderProps {
  /** The plugin manager instance */
  manager: PluginManager;
  /** Children components */
  children: React.ReactNode;
}

/**
 * Provider component for the plugin system
 */
export const PluginProvider: React.FC<PluginProviderProps> = ({ manager, children }) => {
  return <PluginContext.Provider value={manager}>{children}</PluginContext.Provider>;
};

/**
 * Hook to access the plugin manager
 * @returns The plugin manager instance
 * @throws Error if used outside of a PluginProvider
 */
export const usePluginManager = (): PluginManager => {
  const manager = useContext(PluginContext);

  if (!manager) {
    throw new Error('usePluginManager must be used within a PluginProvider');
  }

  return manager;
};

/**
 * Valid component names for plugin hooks
 */
export type PluginComponentName =
  | 'ProductCard'
  | 'ProductDetail'
  | 'ProductList'
  | 'CartItem'
  | 'CartSummary'
  | 'Checkout'
  | 'CheckoutSummary'
  | 'OrderSummary'
  | 'OrderItem'
  | 'Header'
  | 'Footer'
  | 'Navigation'
  | 'SearchBar'
  | 'FilterPanel'
  | 'SortOptions'
  | 'PaginationControls'
  | 'WishlistButton'
  | 'WishlistItem'
  | 'WishlistSummary'
  | 'AccountProfile'
  | 'AddressForm'
  | 'PaymentForm'
  | 'LoginForm'
  | 'RegisterForm';

/**
 * Hook to apply plugin UI hooks for rendering content before a component
 * @param componentName The name of the component
 * @param props The component props
 * @returns An array of JSX elements to render before the component
 */
export const useBeforeRender = (componentName: PluginComponentName, props: any): React.ReactNode[] => {
  const manager = usePluginManager();

  return manager.applyBeforeRenderHooks(componentName, props);
};

/**
 * Hook to apply plugin UI hooks for rendering content after a component
 * @param componentName The name of the component
 * @param props The component props
 * @returns An array of JSX elements to render after the component
 */
export const useAfterRender = (componentName: PluginComponentName, props: any): React.ReactNode[] => {
  const manager = usePluginManager();

  return manager.applyAfterRenderHooks(componentName, props);
};

/**
 * Hook to apply plugin UI hooks for replacing a component
 * @param componentName The name of the component
 * @param DefaultComponent The default component
 * @param props The component props
 * @returns The replacement component, or null to use the default component
 */
export const useReplaceComponent = (
  componentName: PluginComponentName,
  DefaultComponent: React.ComponentType<any>,
  props: any
): React.ReactNode | null => {
  const manager = usePluginManager();

  return manager.applyReplaceComponentHook(componentName, DefaultComponent, props);
};

/**
 * Hook to apply plugin data hooks to modify product data
 * @param products The products array
 * @returns The modified products array
 */
export const useModifiedProducts = <T,>(products: T[]): T[] => {
  const manager = usePluginManager();

  return manager.applyProductsHook(products);
};

/**
 * Hook to apply plugin data hooks to modify a single product
 * @param product The product object
 * @returns The modified product object
 */
export const useModifiedProduct = <T,>(product: T): T => {
  const manager = usePluginManager();

  return manager.applyProductHook(product);
};

/**
 * Hook to apply plugin data hooks to modify cart data
 * @param cart The cart object
 * @returns The modified cart object
 */
export const useModifiedCart = <T,>(cart: T): T => {
  const manager = usePluginManager();

  return manager.applyCartHook(cart);
};

/**
 * Hook to apply plugin data hooks to modify cart item data
 * @param cartItem The cart item object
 * @returns The modified cart item object
 */
export const useModifiedCartItem = <T,>(cartItem: T): T => {
  const manager = usePluginManager();

  return manager.applyCartItemHook(cartItem);
};

/**
 * Hook to apply plugin API hooks before making a fetch request
 * @returns A function to transform the request URL and options
 */
export const useBeforeFetch = (): ((url: string, options: RequestInit) => { url: string; options: RequestInit }) => {
  const manager = usePluginManager();

  return useCallback(
    (url: string, options: RequestInit) => {
      return manager.applyBeforeFetchHook(url, options);
    },
    [manager]
  );
};

/**
 * Hook to apply plugin API hooks after receiving a fetch response
 * @returns A function to transform the response
 */
export const useAfterFetch = (): (<T>(response: T) => T) => {
  const manager = usePluginManager();

  return useCallback(
    <T,>(response: T) => {
      return manager.applyAfterFetchHook(response);
    },
    [manager]
  );
};

/**
 * Hook to apply plugin API hooks to handle fetch errors
 * @returns A function to handle fetch errors
 */
export const useFetchError = (): ((error: Error) => boolean) => {
  const manager = usePluginManager();

  return useCallback(
    (error: Error) => {
      return manager.applyFetchErrorHook(error);
    },
    [manager]
  );
};

/**
 * Higher-order component that applies plugin UI hooks to a component
 * @param componentName The name of the component
 * @param Component The component to wrap
 * @returns A wrapped component with plugin hooks applied
 */
export const withPluginHooks = <P extends object>(
  componentName: PluginComponentName,
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    const manager = usePluginManager();

    // Check if the component should be replaced
    const replacement = manager.applyReplaceComponentHook(componentName, Component, props);
    if (replacement) {
      return <>{replacement}</>;
    }

    // Render before hooks, component, and after hooks
    const beforeElements = manager.applyBeforeRenderHooks(componentName, props);
    const afterElements = manager.applyAfterRenderHooks(componentName, props);

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
