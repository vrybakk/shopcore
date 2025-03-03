# Shopcore Plugin System Documentation

## Introduction

The Shopcore Plugin System provides a flexible and extensible way to enhance your e-commerce application with additional functionality. Plugins can modify data, extend the UI, intercept API calls, and respond to lifecycle events without modifying the core codebase.

### Key Features

- **Modular Architecture**: Add, remove, or update plugins without affecting the core functionality
- **Type-Safe API**: Fully typed plugin interfaces for reliable development
- **Lifecycle Management**: Hooks for plugin initialization, configuration changes, and cleanup
- **UI Extensions**: Add, modify, or replace UI components
- **Data Transformation**: Modify product, cart, and other data before it's used in the application
- **API Interception**: Modify API requests and responses

## Table of Contents

1. [Architecture](#architecture)
2. [Plugin Types and Hooks](#plugin-types-and-hooks)
3. [Creating and Using Plugins](#creating-and-using-plugins)
4. [Plugin API Reference](#plugin-api-reference)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

## Architecture

The Shopcore Plugin System is fully integrated with the `ShopcoreProvider`, which serves as the central hub for all plugin functionality. This integrated approach simplifies the developer experience by eliminating the need for a separate plugin provider.

### Core Components

- **ShopcoreProvider**: The main context provider that initializes and manages plugins
- **Plugin Manager**: Internal service that handles plugin registration, initialization, and hook execution
- **Plugin Interface**: Type definitions for creating compatible plugins

### Integration with ShopcoreProvider

The plugin system is directly integrated with the `ShopcoreProvider`, which manages both core functionality and plugins:

```tsx
// Initialize your application with plugins
import { ShopcoreProvider } from '@shopcore/core';
import { analyticsPlugin } from './plugins/analytics-plugin';
import { discountPlugin } from './plugins/discount-plugin';

function App() {
  return (
    <ShopcoreProvider config={shopcoreConfig} theme={defaultTheme} plugins={[analyticsPlugin, discountPlugin]}>
      <YourApp />
    </ShopcoreProvider>
  );
}
```

The `ShopcoreProvider` handles:

1. **Plugin Registration**: Registers all provided plugins with the plugin manager
2. **Plugin Initialization**: Initializes plugins with the current configuration and theme
3. **Hook Execution**: Executes plugin hooks at appropriate times
4. **Cleanup**: Properly cleans up plugins when the provider is unmounted

## Plugin Types and Hooks

Plugins can implement various types of hooks to extend different aspects of the application:

### Lifecycle Hooks

Lifecycle hooks allow plugins to respond to initialization, configuration changes, and cleanup events:

```typescript
lifecycle: {
  // Called when the plugin is mounted
  onMount: (config, theme) => {
    console.log('Plugin mounted');
    // Initialize plugin resources
  },

  // Called when the plugin is unmounted
  onUnmount: () => {
    console.log('Plugin unmounted');
    // Clean up plugin resources
  },

  // Called when the plugin configuration changes
  onConfigChange: (newConfig) => {
    console.log('Plugin config changed', newConfig);
    // Update plugin based on new configuration
  }
}
```

### Data Hooks

Data hooks allow plugins to transform data before it's used in the application:

```typescript
data: {
  // Modify a product before it's displayed
  onProductLoad: (product) => {
    // Add a custom property
    return {
      ...product,
      isOnSale: product.discountPercentage > 0
    };
  },

  // Modify an array of products
  onProductsLoad: (products) => {
    // Sort products by price
    return [...products].sort((a, b) => a.price - b.price);
  },

  // Modify cart data
  onCartLoad: (cart) => {
    // Calculate additional properties
    return {
      ...cart,
      itemCount: cart.items.length,
      hasDiscountedItems: cart.items.some(item => item.discountPercentage > 0)
    };
  }
}
```

### UI Hooks

UI hooks allow plugins to extend or modify the user interface:

```typescript
ui: {
  // Render content before a component
  beforeRender: {
    ProductDetail: (props) => {
      return <div className="sale-banner">Limited time offer!</div>;
    }
  },

  // Render content after a component
  afterRender: {
    ProductCard: (props) => {
      return <div className="quick-view-button">Quick View</div>;
    }
  },

  // Replace a component entirely
  replaceComponent: {
    PriceDisplay: (DefaultComponent, props) => {
      return <CustomPriceDisplay {...props} showCurrency={true} />;
    }
  }
}
```

### API Hooks

API hooks allow plugins to intercept and modify API requests and responses:

```typescript
api: {
  // Modify a request before it's sent
  beforeFetch: (url, options) => {
    // Add custom headers
    const headers = new Headers(options.headers);
    headers.append('X-Custom-Header', 'value');

    return {
      url,
      options: {
        ...options,
        headers
      }
    };
  },

  // Modify a response before it's used
  afterFetch: (response) => {
    // Add metadata
    return {
      ...response,
      meta: {
        timestamp: Date.now()
      }
    };
  },

  // Handle fetch errors
  onFetchError: (error) => {
    console.error('API error:', error);
    // Return true if the error was handled
    return false;
  }
}
```

## Creating and Using Plugins

### Plugin Structure

A Shopcore plugin is an object that implements the `ShopcorePlugin` interface:

```typescript
import { ShopcorePlugin } from '@shopcore/core';

export const myPlugin: ShopcorePlugin = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'A custom plugin for Shopcore',
  author: 'Your Name',
  config: {
    // Plugin-specific configuration
    enabled: true,
    customOption: 'value',
  },
  hooks: {
    // Implement hooks as needed
    lifecycle: {
      /* ... */
    },
    data: {
      /* ... */
    },
    ui: {
      /* ... */
    },
    api: {
      /* ... */
    },
  },
};
```

### Using Plugins in Your Application

To use plugins in your application, simply pass them to the `ShopcoreProvider`:

```tsx
import { ShopcoreProvider } from '@shopcore/core';
import { myPlugin } from './plugins/my-plugin';
import { anotherPlugin } from './plugins/another-plugin';

function App() {
  return (
    <ShopcoreProvider config={shopcoreConfig} theme={defaultTheme} plugins={[myPlugin, anotherPlugin]}>
      <YourApp />
    </ShopcoreProvider>
  );
}
```

### Accessing Plugin Functionality in Components

The Shopcore context provides hooks to access plugin functionality:

```tsx
import { useModifiedProduct, useBeforeRender, useAfterRender } from '@shopcore/core';

function ProductComponent({ product }) {
  // Apply product data hooks
  const modifiedProduct = useModifiedProduct(product);

  // Get UI elements to render before the component
  const beforeElements = useBeforeRender('ProductDetail', { product: modifiedProduct });

  // Get UI elements to render after the component
  const afterElements = useAfterRender('ProductDetail', { product: modifiedProduct });

  return (
    <>
      {beforeElements}
      <div className='product-detail'>
        <h1>{modifiedProduct.name}</h1>
        <p>{modifiedProduct.description}</p>
        <span className='price'>${modifiedProduct.price}</span>
      </div>
      {afterElements}
    </>
  );
}
```

## Plugin API Reference

### ShopcorePlugin Interface

```typescript
interface ShopcorePlugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  config?: Record<string, any>;
  hooks?: {
    lifecycle?: PluginLifecycleHook;
    data?: PluginDataHook;
    ui?: PluginUIHook;
    api?: PluginAPIHook;
  };
}
```

### Hooks

For detailed information on available hooks, see the [Plugin Types and Hooks](#plugin-types-and-hooks) section.

### Context Hooks

The Shopcore context provides the following hooks for working with plugins:

- `useShopcore()`: Access the Shopcore context
- `useModifiedProduct(product)`: Apply product data hooks to a product
- `useModifiedProducts(products)`: Apply product data hooks to an array of products
- `useModifiedCart(cart)`: Apply cart data hooks to a cart
- `useModifiedCartItem(cartItem)`: Apply cart item data hooks to a cart item
- `useBeforeRender(componentName, props)`: Get UI elements to render before a component
- `useAfterRender(componentName, props)`: Get UI elements to render after a component
- `useReplaceComponent(componentName, DefaultComponent, props)`: Check if a component should be replaced
- `useBeforeFetch()`: Get a function to transform fetch requests
- `useAfterFetch()`: Get a function to transform fetch responses
- `useFetchError()`: Get a function to handle fetch errors

### Higher-Order Component

The `withPluginHooks` higher-order component applies all UI hooks to a component:

```tsx
import { withPluginHooks } from '@shopcore/core';

function MyComponent(props) {
  return <div>My Component</div>;
}

export default withPluginHooks('MyComponent', MyComponent);
```

## Best Practices

### Plugin Development

- **Keep plugins focused**: Each plugin should have a single responsibility
- **Handle errors gracefully**: Wrap hook implementations in try/catch blocks
- **Respect existing data**: Avoid removing or overwriting existing properties
- **Document your plugin**: Provide clear documentation for your plugin's features and configuration options
- **Version your plugins**: Use semantic versioning for your plugins

### Plugin Usage

- **Order matters**: Plugins are applied in the order they are registered
- **Avoid conflicts**: Be aware of potential conflicts between plugins
- **Performance considerations**: Plugins can impact performance, especially if they perform expensive operations
- **Testing**: Test your application with and without plugins to ensure it works correctly in both scenarios

## Examples

### Analytics Plugin

```typescript
import { ShopcorePlugin } from '@shopcore/core';

export const analyticsPlugin: ShopcorePlugin = {
  id: 'analytics-plugin',
  name: 'Analytics Plugin',
  version: '1.0.0',
  description: 'Tracks user interactions and page views',
  config: {
    trackPageViews: true,
    trackClicks: true,
    trackAddToCart: true,
  },
  hooks: {
    lifecycle: {
      onMount: (config, theme) => {
        console.log('Analytics plugin mounted');
        // Initialize analytics
      },
      onUnmount: () => {
        // Clean up analytics
      },
    },
    data: {
      onProductLoad: (product) => {
        // Track product view
        if (typeof window !== 'undefined') {
          console.log(`[Analytics] Product viewed: ${product.name}`);
        }
        return product;
      },
    },
    ui: {
      afterRender: {
        ProductCard: (props) => {
          // Add click tracking
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              const productCard = document.querySelector(`[data-product-id="${props.product.id}"]`);
              if (productCard) {
                productCard.addEventListener('click', () => {
                  console.log(`[Analytics] Product clicked: ${props.product.name}`);
                });
              }
            }, 0);
          }
          return null;
        },
      },
    },
  },
};
```

### Discount Plugin

```typescript
import { ShopcorePlugin } from '@shopcore/core';

export const discountPlugin: ShopcorePlugin = {
  id: 'discount-plugin',
  name: 'Discount Plugin',
  version: '1.0.0',
  description: 'Applies discounts to products',
  config: {
    globalDiscountPercentage: 10,
    discountCode: 'SUMMER10',
    applyToAll: false
  },
  hooks: {
    data: {
      onProductLoad: (product) => {
        // Apply discount if configured
        if (discountPlugin.config?.applyToAll) {
          const discountPercentage = discountPlugin.config.globalDiscountPercentage || 0;
          const discountedPrice = product.price * (1 - discountPercentage / 100);

          return {
            ...product,
            originalPrice: product.price,
            price: discountedPrice,
            discountPercentage,
            discountApplied: true
          };
        }
        return product;
      },
      onCartLoad: (cart) => {
        // Apply discount to cart if discount code is applied
        if (cart.discountCode === discountPlugin.config?.discountCode) {
          const discountPercentage = discountPlugin.config.globalDiscountPercentage || 0;
          const discountAmount = cart.subtotal * (discountPercentage / 100);

          return {
            ...cart,
            discountPercentage,
            discountAmount,
            total: cart.subtotal - discountAmount
          };
        }
        return cart;
      }
    },
    ui: {
      beforeRender: {
        ProductDetail: (props) => {
          if (props.product.discountApplied) {
            return (
              <div className="discount-badge">
                {props.product.discountPercentage}% OFF
              </div>
            );
          }
          return null;
        }
      }
    }
  }
};
```

### Wishlist Plugin

```typescript
import { ShopcorePlugin } from '@shopcore/core';
import React, { useState, useEffect } from 'react';

// Simple wishlist storage
const wishlistStorage = {
  getWishlist: () => {
    if (typeof window === 'undefined') return [];
    const wishlist = localStorage.getItem('shopcore-wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  },
  addToWishlist: (productId) => {
    if (typeof window === 'undefined') return;
    const wishlist = wishlistStorage.getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('shopcore-wishlist', JSON.stringify(wishlist));
    }
  },
  removeFromWishlist: (productId) => {
    if (typeof window === 'undefined') return;
    const wishlist = wishlistStorage.getWishlist();
    const index = wishlist.indexOf(productId);
    if (index !== -1) {
      wishlist.splice(index, 1);
      localStorage.setItem('shopcore-wishlist', JSON.stringify(wishlist));
    }
  },
  isInWishlist: (productId) => {
    return wishlistStorage.getWishlist().includes(productId);
  }
};

// Wishlist button component
const WishlistButton = ({ product }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(wishlistStorage.isInWishlist(product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    if (isInWishlist) {
      wishlistStorage.removeFromWishlist(product.id);
    } else {
      wishlistStorage.addToWishlist(product.id);
    }
    setIsInWishlist(!isInWishlist);
  };

  return (
    <button
      className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`}
      onClick={toggleWishlist}
    >
      {isInWishlist ? '❤️' : '🤍'}
    </button>
  );
};

export const wishlistPlugin: ShopcorePlugin = {
  id: 'wishlist-plugin',
  name: 'Wishlist Plugin',
  version: '1.0.0',
  description: 'Adds wishlist functionality',
  hooks: {
    data: {
      onProductLoad: (product) => {
        // Add wishlist status to product
        return {
          ...product,
          isInWishlist: wishlistStorage.isInWishlist(product.id)
        };
      }
    },
    ui: {
      afterRender: {
        ProductCard: (props) => {
          return <WishlistButton product={props.product} />;
        },
        ProductDetail: (props) => {
          return <WishlistButton product={props.product} />;
        }
      }
    }
  }
};
```

## Conclusion

The Shopcore Plugin System provides a powerful way to extend and customize your e-commerce application. By implementing various hooks, plugins can modify data, extend the UI, intercept API calls, and react to lifecycle events.

This architecture allows for a modular and maintainable codebase, where features can be added or removed without modifying the core code. By following the guidelines and best practices outlined in this documentation, you can create robust and reusable plugins that enhance the functionality of your Shopcore application.
