import { ShopcorePlugin } from '../core/plugins/types';

/**
 * Analytics plugin for tracking user interactions and page views
 */
export const analyticsPlugin: ShopcorePlugin = {
  id: 'shopcore-analytics',
  name: 'Shopcore Analytics',
  version: '1.0.0',
  description: 'Tracks user interactions and page views',
  author: 'Shopcore Team',
  config: {
    trackPageViews: true,
    trackClicks: true,
    trackAddToCart: true,
    trackCheckout: true,
    trackPurchase: true,
    anonymizeIp: true,
    samplingRate: 100, // percentage of users to track
  },
  hooks: {
    lifecycle: {
      onMount: (config, theme) => {
        console.log('Analytics plugin mounted');

        // Initialize analytics based on config
        if (typeof window !== 'undefined') {
          window.addEventListener('load', () => {
            if (analyticsPlugin.config?.trackPageViews) {
              trackPageView(window.location.pathname);
            }
          });
        }
      },
      onUnmount: () => {
        console.log('Analytics plugin unmounted');

        // Clean up event listeners
        if (typeof window !== 'undefined') {
          window.removeEventListener('load', () => {
            // Cleanup logic
          });
        }
      },
      onConfigChange: (newConfig) => {
        console.log('Analytics plugin config changed', newConfig);
        // Update plugin configuration
        analyticsPlugin.config = { ...analyticsPlugin.config, ...newConfig };
      },
    },
    data: {
      onProductLoad: (product) => {
        // Track product view
        if (typeof window !== 'undefined' && analyticsPlugin.config?.trackPageViews) {
          trackProductView(product);
        }
        return product;
      },
      onCartLoad: (cart) => {
        // Track cart view
        if (typeof window !== 'undefined' && analyticsPlugin.config?.trackPageViews) {
          trackCartView(cart);
        }
        return cart;
      },
    },
    ui: {
      beforeRender: {
        ProductDetail: (props) => {
          // Track product detail view
          if (typeof window !== 'undefined' && analyticsPlugin.config?.trackPageViews && props.product) {
            trackProductDetailView(props.product);
          }
          return null;
        },
        Checkout: (props) => {
          // Track checkout start
          if (typeof window !== 'undefined' && analyticsPlugin.config?.trackCheckout) {
            trackCheckoutStart(props.cart);
          }
          return null;
        },
      },
      afterRender: {
        ProductCard: (props) => {
          // Add click tracking to product cards
          if (typeof window !== 'undefined' && analyticsPlugin.config?.trackClicks && props.product) {
            setTimeout(() => {
              const productCard = document.querySelector(`[data-product-id="${props.product.id}"]`);
              if (productCard) {
                productCard.addEventListener('click', () => {
                  trackProductClick(props.product);
                });
              }
            }, 0);
          }
          return null;
        },
      },
    },
    api: {
      beforeFetch: (url, options) => {
        // Add analytics tracking headers
        const headers = new Headers(options.headers);
        headers.append('X-Analytics-Tracking', 'enabled');

        return {
          url,
          options: {
            ...options,
            headers,
          },
        };
      },
      afterFetch: <T>(response: T) => {
        // Track API response time
        if (response && typeof response === 'object' && 'meta' in response && response.meta) {
          const typedResponse = response as unknown as { meta: { url: string; responseTime: number } };
          trackApiResponse(typedResponse.meta.url, typedResponse.meta.responseTime);
        }
        return response;
      },
      onFetchError: (error) => {
        // Track API errors
        trackApiError(error);
        return false; // Let the application handle the error
      },
    },
  },
};

// Analytics tracking functions
function trackPageView(path: string) {
  console.log(`[Analytics] Page view: ${path}`);
  // Implementation would send data to analytics service
}

function trackProductView(product: any) {
  console.log(`[Analytics] Product view: ${product.name} (${product.id})`);
  // Implementation would send data to analytics service
}

function trackProductDetailView(product: any) {
  console.log(`[Analytics] Product detail view: ${product.name} (${product.id})`);
  // Implementation would send data to analytics service
}

function trackCartView(cart: any) {
  console.log(`[Analytics] Cart view: ${cart.items?.length || 0} items, total: ${cart.total}`);
  // Implementation would send data to analytics service
}

function trackCheckoutStart(cart: any) {
  console.log(`[Analytics] Checkout started: ${cart.items?.length || 0} items, total: ${cart.total}`);
  // Implementation would send data to analytics service
}

function trackProductClick(product: any) {
  console.log(`[Analytics] Product clicked: ${product.name} (${product.id})`);
  // Implementation would send data to analytics service
}

function trackApiResponse(url: string, responseTime: number) {
  console.log(`[Analytics] API response: ${url} (${responseTime}ms)`);
  // Implementation would send data to analytics service
}

function trackApiError(error: Error) {
  console.log(`[Analytics] API error: ${error.message}`);
  // Implementation would send data to analytics service
}
