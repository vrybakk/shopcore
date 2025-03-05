/**
 * Shopcore Analytics Plugin Example
 *
 * This file demonstrates how to create a plugin for Shopcore that tracks
 * user interactions and product views.
 */

import { ShopcorePlugin } from '../../src/core/plugins/types';
import { createLogger } from '../../src/utils/logger';

// Create a logger instance
const logger = createLogger({ debug: true, mode: 'development' });

/**
 * Configuration options for the analytics plugin
 */
export interface AnalyticsPluginConfig {
  /** The analytics API endpoint */
  apiEndpoint: string;
  /** Whether to enable debug logging */
  debug?: boolean;
  /** User identifier (if known) */
  userId?: string;
  /** Session identifier */
  sessionId?: string;
  /** Whether to track page views automatically */
  trackPageViews?: boolean;
  /** Whether to track product views automatically */
  trackProductViews?: boolean;
  /** Whether to track cart actions automatically */
  trackCartActions?: boolean;
}

/**
 * Analytics event types
 */
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  PRODUCT_VIEW = 'product_view',
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  CHECKOUT_START = 'checkout_start',
  CHECKOUT_COMPLETE = 'checkout_complete',
  CUSTOM = 'custom',
}

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  /** Event type */
  type: AnalyticsEventType | string;
  /** Timestamp when the event occurred */
  timestamp: number;
  /** User identifier (if known) */
  userId?: string;
  /** Session identifier */
  sessionId?: string;
  /** Page URL where the event occurred */
  url?: string;
  /** Additional event data */
  data?: Record<string, any>;
}

/**
 * Analytics service class
 */
class AnalyticsService {
  private config: AnalyticsPluginConfig;
  private queue: AnalyticsEvent[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private pageViewSent = false;

  constructor(config: AnalyticsPluginConfig) {
    this.config = config;

    // Set up automatic flush interval
    this.flushInterval = setInterval(() => this.flush(), 30000);

    // Track initial page view if enabled
    if (config.trackPageViews && typeof window !== 'undefined') {
      this.trackPageView();

      // Set up history change listener for SPA navigation
      window.addEventListener('popstate', () => this.trackPageView());

      // Intercept pushState and replaceState
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (this: AnalyticsService, data: any, unused: string, url?: string | URL | null) {
        originalPushState.apply(history, [data, unused, url]);
        this.trackPageView();
      }.bind(this);

      history.replaceState = function (this: AnalyticsService, data: any, unused: string, url?: string | URL | null) {
        originalReplaceState.apply(history, [data, unused, url]);
        this.trackPageView();
      }.bind(this);
    }
  }

  /**
   * Track a page view event
   */
  trackPageView(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.track({
      type: AnalyticsEventType.PAGE_VIEW,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      url: window.location.href,
      data: {
        title: document.title,
        referrer: document.referrer,
      },
    });

    this.pageViewSent = true;
  }

  /**
   * Track a product view event
   * @param product The product being viewed
   */
  trackProductView(product: any): void {
    this.track({
      type: AnalyticsEventType.PRODUCT_VIEW,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      data: {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productCurrency: product.currency,
        productCategory: product.categories?.[0],
      },
    });
  }

  /**
   * Track an add to cart event
   * @param product The product being added to the cart
   * @param quantity The quantity being added
   */
  trackAddToCart(product: any, quantity: number): void {
    this.track({
      type: AnalyticsEventType.ADD_TO_CART,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      data: {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productCurrency: product.currency,
        quantity,
        totalValue: product.price * quantity,
      },
    });
  }

  /**
   * Track a remove from cart event
   * @param product The product being removed from the cart
   * @param quantity The quantity being removed
   */
  trackRemoveFromCart(product: any, quantity: number): void {
    this.track({
      type: AnalyticsEventType.REMOVE_FROM_CART,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      data: {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productCurrency: product.currency,
        quantity,
        totalValue: product.price * quantity,
      },
    });
  }

  /**
   * Track a checkout start event
   * @param cart The cart being checked out
   */
  trackCheckoutStart(cart: any): void {
    this.track({
      type: AnalyticsEventType.CHECKOUT_START,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      data: {
        cartId: cart.id,
        cartTotal: cart.total,
        cartCurrency: cart.currency,
        itemCount: cart.items?.length || 0,
        items: cart.items?.map((item: any) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  }

  /**
   * Track a checkout complete event
   * @param order The completed order
   */
  trackCheckoutComplete(order: any): void {
    this.track({
      type: AnalyticsEventType.CHECKOUT_COMPLETE,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      data: {
        orderId: order.id,
        orderTotal: order.total,
        orderCurrency: order.currency,
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
        itemCount: order.items?.length || 0,
        items: order.items?.map((item: any) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  }

  /**
   * Track a custom event
   * @param eventType The custom event type
   * @param eventData The custom event data
   */
  trackCustomEvent(eventType: string, eventData: Record<string, any>): void {
    this.track({
      type: eventType,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      data: eventData,
    });
  }

  /**
   * Track an analytics event
   * @param event The event to track
   */
  private track(event: AnalyticsEvent): void {
    if (this.config.debug) {
      logger.debug('Analytics event:', event);
    }

    this.queue.push(event);

    // Flush immediately if queue gets too large
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  /**
   * Flush the event queue to the analytics API
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status} ${response.statusText}`);
      }

      if (this.config.debug) {
        logger.debug(`Analytics: ${events.length} events sent successfully`);
      }
    } catch (error) {
      // Put events back in the queue to retry later
      this.queue = [...events, ...this.queue];

      logger.error('Analytics API error:', error);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    // Flush any remaining events
    this.flush();
  }
}

/**
 * Create an analytics plugin for Shopcore
 * @param config The analytics plugin configuration
 * @returns A Shopcore plugin
 */
export function createAnalyticsPlugin(config: AnalyticsPluginConfig): ShopcorePlugin {
  // Create an analytics service instance
  const analyticsService = new AnalyticsService(config);

  return {
    id: 'shopcore-analytics',
    name: 'Shopcore Analytics',
    version: '1.0.0',
    description: 'Tracks user interactions and page views',
    author: 'Shopcore Team',
    config,
    hooks: {
      lifecycle: {
        onMount: (config, theme) => {
          logger.debug('Analytics plugin initialized');
        },
        onUnmount: () => {
          analyticsService.destroy();
          logger.debug('Analytics plugin destroyed');
        },
      },
      data: {
        onProductLoad: (product) => {
          // Track product view if enabled
          if (config.trackProductViews) {
            analyticsService.trackProductView(product);
          }
          return product;
        },
        onCartLoad: (cart) => {
          // No tracking needed for cart load
          return cart;
        },
      },
      ui: {
        beforeRender: {
          ProductCard: (props) => {
            // No UI changes needed before product card
            return null;
          },
          Checkout: (props) => {
            // Track checkout start
            if (config.trackCartActions && props.cart) {
              analyticsService.trackCheckoutStart(props.cart);
            }
            return null;
          },
        },
        afterRender: {
          ProductCard: (props) => {
            // No UI changes needed after product card
            return null;
          },
        },
      },
      api: {
        afterFetch: (response) => {
          // Track checkout complete event if the response contains order data
          if (config.trackCartActions && response && typeof response === 'object' && 'order' in response) {
            analyticsService.trackCheckoutComplete(response.order);
          }
          return response;
        },
      },
    },
  };
}
