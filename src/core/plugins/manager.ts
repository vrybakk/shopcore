/**
 * Shopcore Plugin Manager
 *
 * This file contains the plugin manager for Shopcore, which handles plugin registration,
 * initialization, and execution of plugin hooks.
 */

import { createLogger } from '../../utils/logger';
import { ShopcoreConfig } from '../context/ShopcoreContext';
import { Theme } from '../theme/theme';
import { ComponentName, ShopcorePlugin } from './types';

// Create a logger instance
const logger = createLogger({ debug: true, mode: 'development' });

/**
 * Plugin Manager class responsible for registering, initializing, and managing plugins
 */
export class PluginManager {
  private plugins: Map<string, ShopcorePlugin> = new Map();
  private config: ShopcoreConfig | null = null;
  private theme: Theme | null = null;
  private initialized = false;

  /**
   * Register a plugin with the plugin manager
   * @param plugin The plugin to register
   * @throws Error if a plugin with the same ID is already registered
   */
  register(plugin: ShopcorePlugin): void {
    if (!plugin.id) {
      throw new Error('Plugin must have an ID');
    }

    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with ID "${plugin.id}" is already registered`);
    }

    this.plugins.set(plugin.id, plugin);

    // If already initialized, initialize this plugin immediately
    if (this.initialized && this.config && this.theme) {
      this.initializePlugin(plugin, this.config, this.theme);
    }
  }

  /**
   * Unregister a plugin from the plugin manager
   * @param pluginId The ID of the plugin to unregister
   * @returns true if the plugin was unregistered, false if it wasn't found
   */
  unregister(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);

    if (plugin && plugin.hooks?.lifecycle?.onUnmount) {
      try {
        plugin.hooks.lifecycle.onUnmount();
      } catch (error) {
        console.error(`Error in onUnmount hook for plugin "${pluginId}":`, error);
      }
    }

    return this.plugins.delete(pluginId);
  }

  /**
   * Get a plugin by ID
   * @param pluginId The ID of the plugin to get
   * @returns The plugin, or undefined if not found
   */
  getPlugin(pluginId: string): ShopcorePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all registered plugins
   * @returns An array of all registered plugins
   */
  getAllPlugins(): ShopcorePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Initialize the plugin manager with the Shopcore configuration and theme
   * @param config The Shopcore configuration
   * @param theme The Shopcore theme
   */
  initialize(config: ShopcoreConfig, theme: Theme): void {
    this.config = config;
    this.theme = theme;
    this.initialized = true;

    // Initialize all registered plugins
    this.plugins.forEach((plugin) => {
      this.initializePlugin(plugin, config, theme);
    });
  }

  /**
   * Initialize a single plugin
   * @param plugin The plugin to initialize
   * @param config The Shopcore configuration
   * @param theme The Shopcore theme
   */
  private initializePlugin(plugin: ShopcorePlugin, config: ShopcoreConfig, theme: Theme): void {
    if (plugin.hooks?.lifecycle?.onMount) {
      try {
        plugin.hooks.lifecycle.onMount(config, theme);
      } catch (error) {
        console.error(`Error in onMount hook for plugin "${plugin.id}":`, error);
      }
    }
  }

  /**
   * Apply a product hook to modify a product
   * @param product The product to modify
   * @returns The modified product
   */
  applyProductHook<T>(product: T): T {
    let modifiedProduct = { ...product };

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.data?.onProductLoad) {
        try {
          modifiedProduct = plugin.hooks.data.onProductLoad(modifiedProduct);
        } catch (error) {
          console.error(`Error in onProductLoad hook for plugin "${plugin.id}":`, error);
        }
      }
    });

    return modifiedProduct;
  }

  /**
   * Apply a products hook to modify an array of products
   * @param products The products to modify
   * @returns The modified products
   */
  applyProductsHook<T>(products: T[]): T[] {
    let modifiedProducts = [...products];

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.data?.onProductsLoad) {
        try {
          modifiedProducts = plugin.hooks.data.onProductsLoad(modifiedProducts);
        } catch (error) {
          console.error(`Error in onProductsLoad hook for plugin "${plugin.id}":`, error);
        }
      }
    });

    return modifiedProducts;
  }

  /**
   * Apply a cart hook to modify cart data
   * @param cart The cart to modify
   * @returns The modified cart
   */
  applyCartHook<T>(cart: T): T {
    let modifiedCart = { ...cart };

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.data?.onCartLoad) {
        try {
          modifiedCart = plugin.hooks.data.onCartLoad(modifiedCart);
        } catch (error) {
          console.error(`Error in onCartLoad hook for plugin "${plugin.id}":`, error);
        }
      }
    });

    return modifiedCart;
  }

  /**
   * Apply a cart item hook to modify cart item data
   * @param cartItem The cart item to modify
   * @returns The modified cart item
   */
  applyCartItemHook<T>(cartItem: T): T {
    let modifiedCartItem = { ...cartItem };

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.data?.onCartItemLoad) {
        try {
          modifiedCartItem = plugin.hooks.data.onCartItemLoad(modifiedCartItem);
        } catch (error) {
          console.error(`Error in onCartItemLoad hook for plugin "${plugin.id}":`, error);
        }
      }
    });

    return modifiedCartItem;
  }

  /**
   * Apply before render hooks for a component
   * @param componentName The name of the component
   * @param props The component props
   * @returns An array of elements to render before the component
   */
  applyBeforeRenderHooks(componentName: ComponentName, props: any): React.ReactNode[] {
    const elements: React.ReactNode[] = [];

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.ui?.beforeRender && plugin.hooks.ui.beforeRender[componentName]) {
        try {
          const element = plugin.hooks.ui.beforeRender[componentName](props);
          if (element) {
            elements.push(element);
          }
        } catch (error) {
          console.error(
            `Error in beforeRender hook for plugin "${plugin.id}" and component "${componentName}":`,
            error
          );
        }
      }
    });

    return elements;
  }

  /**
   * Apply after render hooks for a component
   * @param componentName The name of the component
   * @param props The component props
   * @returns An array of elements to render after the component
   */
  applyAfterRenderHooks(componentName: ComponentName, props: any): React.ReactNode[] {
    const elements: React.ReactNode[] = [];

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.ui?.afterRender && plugin.hooks.ui.afterRender[componentName]) {
        try {
          const element = plugin.hooks.ui.afterRender[componentName](props);
          if (element) {
            elements.push(element);
          }
        } catch (error) {
          console.error(`Error in afterRender hook for plugin "${plugin.id}" and component "${componentName}":`, error);
        }
      }
    });

    return elements;
  }

  /**
   * Apply replace component hooks for a component
   * @param componentName The name of the component
   * @param DefaultComponent The default component
   * @param props The component props
   * @returns The replacement component, or null to use the default component
   */
  applyReplaceComponentHook(
    componentName: ComponentName,
    DefaultComponent: React.ComponentType<any>,
    props: any
  ): React.ReactNode | null {
    let replacement: React.ReactNode | null = null;

    // Process plugins in reverse order to give priority to the last registered plugin
    Array.from(this.plugins.values())
      .reverse()
      .some((plugin) => {
        if (plugin.hooks?.ui?.replaceComponent && plugin.hooks.ui.replaceComponent[componentName]) {
          try {
            const result = plugin.hooks.ui.replaceComponent[componentName](DefaultComponent, props);
            if (result) {
              replacement = result;
              return true; // Stop processing once a replacement is found
            }
          } catch (error) {
            console.error(
              `Error in replaceComponent hook for plugin "${plugin.id}" and component "${componentName}":`,
              error
            );
          }
        }
        return false;
      });

    return replacement;
  }

  /**
   * Apply before fetch hooks for a fetch request
   * @param url The request URL
   * @param options The request options
   * @returns The modified URL and options
   */
  applyBeforeFetchHook(url: string, options: RequestInit): { url: string; options: RequestInit } {
    let modifiedUrl = url;
    let modifiedOptions = { ...options };

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.api?.beforeFetch) {
        try {
          const result = plugin.hooks.api.beforeFetch(modifiedUrl, modifiedOptions);
          modifiedUrl = result.url;
          modifiedOptions = result.options;
        } catch (error) {
          console.error(`Error in beforeFetch hook for plugin "${plugin.id}":`, error);
        }
      }
    });

    return { url: modifiedUrl, options: modifiedOptions };
  }

  /**
   * Apply after fetch hooks for a fetch response
   * @param response The response to modify
   * @returns The modified response
   */
  applyAfterFetchHook<T>(response: T): T {
    let modifiedResponse = response;

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.api?.afterFetch) {
        try {
          modifiedResponse = plugin.hooks.api.afterFetch(modifiedResponse);
        } catch (error) {
          console.error(`Error in afterFetch hook for plugin "${plugin.id}":`, error);
        }
      }
    });

    return modifiedResponse;
  }

  /**
   * Apply fetch error hooks for a fetch error
   * @param error The error to handle
   * @returns true if the error was handled, false otherwise
   */
  applyFetchErrorHook(error: Error): boolean {
    let handled = false;

    this.plugins.forEach((plugin) => {
      if (plugin.hooks?.api?.onFetchError) {
        try {
          if (plugin.hooks.api.onFetchError(error)) {
            handled = true;
          }
        } catch (pluginError) {
          console.error(`Error in onFetchError hook for plugin "${plugin.id}":`, pluginError);
        }
      }
    });

    return handled;
  }
}
