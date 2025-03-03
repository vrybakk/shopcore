/**
 * Shopcore Plugin System Types
 *
 * This file contains the type definitions for the Shopcore plugin system.
 */

import React from 'react';
import { ShopcoreConfig } from '../context/ShopcoreContext';
import { Theme } from '../theme/theme';

/**
 * Component names that can be extended by plugins
 */
export type ComponentName =
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
 * Lifecycle hooks for plugins
 */
export interface PluginLifecycleHook {
  /**
   * Called when the plugin is mounted
   * @param config The Shopcore configuration
   * @param theme The Shopcore theme
   */
  onMount?: (config: ShopcoreConfig, theme: Theme) => void;

  /**
   * Called when the plugin is unmounted
   */
  onUnmount?: () => void;

  /**
   * Called when the plugin configuration changes
   * @param config The new plugin configuration
   */
  onConfigChange?: (config: any) => void;
}

/**
 * Data hooks for plugins
 */
export interface PluginDataHook {
  /**
   * Called when a product is loaded
   * @param product The product data
   * @returns The modified product data
   */
  onProductLoad?: <T>(product: T) => T;

  /**
   * Called when multiple products are loaded
   * @param products The products data
   * @returns The modified products data
   */
  onProductsLoad?: <T>(products: T[]) => T[];

  /**
   * Called when the cart is loaded
   * @param cart The cart data
   * @returns The modified cart data
   */
  onCartLoad?: <T>(cart: T) => T;

  /**
   * Called when a cart item is loaded
   * @param cartItem The cart item data
   * @returns The modified cart item data
   */
  onCartItemLoad?: <T>(cartItem: T) => T;

  /**
   * Called when an order is loaded
   * @param order The order data
   * @returns The modified order data
   */
  onOrderLoad?: <T>(order: T) => T;

  /**
   * Called when user data is loaded
   * @param user The user data
   * @returns The modified user data
   */
  onUserLoad?: <T>(user: T) => T;
}

/**
 * UI hooks for plugins
 */
export interface PluginUIHook {
  /**
   * Render content before a component
   */
  beforeRender?: {
    [K in ComponentName]?: (props: any) => React.ReactNode;
  };

  /**
   * Render content after a component
   */
  afterRender?: {
    [K in ComponentName]?: (props: any) => React.ReactNode;
  };

  /**
   * Replace a component with a custom implementation
   */
  replaceComponent?: {
    [K in ComponentName]?: (DefaultComponent: React.ComponentType<any>, props: any) => React.ReactNode | null;
  };
}

/**
 * API hooks for plugins
 */
export interface PluginAPIHook {
  /**
   * Called before making a fetch request
   * @param url The request URL
   * @param options The request options
   * @returns The modified URL and options
   */
  beforeFetch?: (url: string, options: RequestInit) => { url: string; options: RequestInit };

  /**
   * Called after receiving a fetch response
   * @param response The response data
   * @returns The modified response data
   */
  afterFetch?: <T>(response: T) => T;

  /**
   * Called when a fetch request fails
   * @param error The error object
   * @returns Whether the error was handled
   */
  onFetchError?: (error: Error) => boolean;
}

/**
 * Plugin hooks
 */
export interface PluginHooks {
  /**
   * Lifecycle hooks
   */
  lifecycle?: PluginLifecycleHook;

  /**
   * Data hooks
   */
  data?: PluginDataHook;

  /**
   * UI hooks
   */
  ui?: PluginUIHook;

  /**
   * API hooks
   */
  api?: PluginAPIHook;
}

/**
 * Shopcore plugin interface
 */
export interface ShopcorePlugin {
  /**
   * Unique identifier for the plugin
   */
  id: string;

  /**
   * Display name of the plugin
   */
  name: string;

  /**
   * Plugin version
   */
  version: string;

  /**
   * Plugin description
   */
  description?: string;

  /**
   * Plugin author
   */
  author?: string;

  /**
   * Plugin configuration
   */
  config?: Record<string, any>;

  /**
   * Plugin hooks
   */
  hooks?: PluginHooks;
}
