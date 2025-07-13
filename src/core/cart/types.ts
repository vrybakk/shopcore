// Base price interface
export interface BasePrice {
  amount: number;
  currency: string;
  compareAt?: number;
}

// Base variant interface
export interface BaseVariant {
  id: string;
  sku?: string;
  price: BasePrice;
}

// Base product interface
export interface BaseProduct {
  id: string;
  sku?: string;
  name: string;
  price: BasePrice;
}

// Configuration types for extensibility
export type VariantConfig = {
  attributes?: Record<string, unknown>;
  options?: Record<string, unknown>;
};

export type ProductConfig = {
  attributes?: Record<string, unknown>;
  variants?: VariantConfig;
  category?: Record<string, unknown>;
};

// Enhanced variant type with generic support
export interface ShopCoreVariant<TConfig extends VariantConfig | undefined = undefined> extends BaseVariant {
  attributes?: TConfig extends VariantConfig ? TConfig['attributes'] : undefined;
  options?: TConfig extends VariantConfig ? TConfig['options'] : undefined;
}

// Enhanced product type with generic support
export interface ShopCoreProduct<TConfig extends ProductConfig = {}> extends BaseProduct {
  attributes?: TConfig['attributes'];
  category?: TConfig['category'];
  variants?: ShopCoreVariant<TConfig['variants']>[];
}

// Cart item type
export interface CartItem<TConfig extends ProductConfig = {}> {
  id: string;
  product: ShopCoreProduct<TConfig>;
  variant?: ShopCoreVariant<TConfig['variants']>;
  quantity: number;
  price: BasePrice;
}

// Cart state interface
export interface CartState<TConfig extends ProductConfig = {}> {
  items: CartItem<TConfig>[];
  isOpen: boolean;
  totals: {
    subtotal: number;
    tax?: number;
    shipping?: number;
    total: number;
    currency: string;
  };
  metadata?: {
    lastUpdated?: Date;
    [key: string]: unknown;
  };
}

// Cart actions interface
export interface CartActions<TConfig extends ProductConfig = {}> {
  addItem: (
    product: ShopCoreProduct<TConfig>,
    options?: {
      variant?: ShopCoreVariant<TConfig['variants']>;
      quantity?: number;
    }
  ) => Promise<void>;

  removeItem: (itemId: string) => Promise<void>;

  updateQuantity: (itemId: string, quantity: number, options?: { validate?: boolean }) => Promise<void>;

  updateItem: (itemId: string, updates: Partial<CartItem<TConfig>>) => Promise<void>;

  clearCart: () => Promise<void>;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// Cart events interface
export interface CartEvents<TConfig extends ProductConfig = {}> {
  onBeforeAddItem?: (
    product: ShopCoreProduct<TConfig>,
    options?: { variant?: ShopCoreVariant<TConfig['variants']>; quantity?: number }
  ) => Promise<boolean | void>;

  onAfterAddItem?: (item: CartItem<TConfig>) => void;

  onBeforeRemoveItem?: (itemId: string) => Promise<boolean | void>;

  onBeforeUpdateQuantity?: (itemId: string, newQuantity: number, currentQuantity: number) => Promise<boolean | void>;

  onCartUpdate?: (state: CartState<TConfig>) => void;

  onError?: (error: Error) => void;
}

// Cart configuration interface
export interface CartConfig<TConfig extends ProductConfig = {}> {
  // Storage configuration
  storage?: {
    type: 'localStorage' | 'sessionStorage' | 'none';
    key?: string;
  };

  // Cart behavior
  behavior?: {
    maxQuantityPerItem?: number;
    minQuantityPerItem?: number;
    allowNegativeStock?: boolean;
    mergeSameItems?: boolean;
  };

  // Price calculation
  pricing?: {
    calculateTotals?: (items: CartItem<TConfig>[]) => CartState<TConfig>['totals'];
    shouldIncludeTax?: boolean;
    taxRate?: number;
  };

  // Events
  events?: CartEvents<TConfig>;
}
