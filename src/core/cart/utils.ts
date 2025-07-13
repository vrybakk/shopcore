import { CartItem, CartState, ProductConfig, ShopCoreProduct, ShopCoreVariant } from './types';

/**
 * Generates a unique ID for cart items
 */
export const generateCartItemId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates cart totals
 */
export const calculateCartTotals = <TConfig extends ProductConfig>(
  items: CartItem<TConfig>[],
  taxRate: number = 0
): CartState<TConfig>['totals'] => {
  const subtotal = items.reduce((total, item) => {
    return total + item.price.amount * item.quantity;
  }, 0);

  const tax = taxRate > 0 ? subtotal * taxRate : 0;
  const total = subtotal + tax;

  // Get currency from the first item, or default to USD
  const currency = items[0]?.price.currency || 'USD';

  return {
    subtotal,
    tax: tax || undefined,
    total,
    currency,
  };
};

/**
 * Checks if two cart items are equal (same product and variant)
 */
export const areCartItemsEqual = <TConfig extends ProductConfig>(
  item1: CartItem<TConfig>,
  item2: CartItem<TConfig>
): boolean => {
  if (item1.product.id !== item2.product.id) return false;

  if (item1.variant && item2.variant) {
    return item1.variant.id === item2.variant.id;
  }

  return !item1.variant && !item2.variant;
};

/**
 * Creates a cart item from a product and variant
 */
export const createCartItem = <TConfig extends ProductConfig>(
  product: ShopCoreProduct<TConfig>,
  quantity: number = 1,
  variant?: ShopCoreVariant<TConfig['variants']>
): CartItem<TConfig> => {
  return {
    id: generateCartItemId(),
    product,
    variant,
    quantity,
    price: variant?.price || product.price,
  };
};

/**
 * Validates cart item quantity
 */
export const validateQuantity = (quantity: number, min: number = 1, max: number = Infinity): boolean => {
  return quantity >= min && quantity <= max;
};

/**
 * Merges cart items that are the same product and variant
 */
export const mergeCartItems = <TConfig extends ProductConfig>(items: CartItem<TConfig>[]): CartItem<TConfig>[] => {
  const mergedItems: CartItem<TConfig>[] = [];

  items.forEach((item) => {
    const existingItem = mergedItems.find((mergedItem) => areCartItemsEqual(mergedItem, item));

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      mergedItems.push({ ...item });
    }
  });

  return mergedItems;
};

/**
 * Persists cart state to storage
 */
export const persistCart = <TConfig extends ProductConfig>(
  state: CartState<TConfig>,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
  key: string = 'shopcore_cart'
): void => {
  try {
    const storage = window[storageType];
    storage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to persist cart:', error);
  }
};

/**
 * Loads cart state from storage
 */
export const loadCart = <TConfig extends ProductConfig>(
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
  key: string = 'shopcore_cart'
): CartState<TConfig> | null => {
  try {
    const storage = window[storageType];
    const data = storage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load cart:', error);
    return null;
  }
};
