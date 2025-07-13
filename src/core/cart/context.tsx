'use client';

import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import { CartActions, CartConfig, CartItem, CartState, ProductConfig, ShopCoreProduct, ShopCoreVariant } from './types';
import { calculateCartTotals, createCartItem, loadCart, mergeCartItems, persistCart, validateQuantity } from './utils';

// Cart Context type
interface CartContextValue<TConfig extends ProductConfig = {}> {
  state: CartState<TConfig>;
  actions: CartActions<TConfig>;
}

// Create the context
const CartContext = createContext<CartContextValue<any> | null>(null);

// Action types for the reducer
type CartAction<TConfig extends ProductConfig = {}> =
  | { type: 'SET_ITEMS'; payload: CartItem<TConfig>[] }
  | { type: 'ADD_ITEM'; payload: CartItem<TConfig> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; updates: Partial<CartItem<TConfig>> } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_IS_OPEN'; payload: boolean }
  | { type: 'UPDATE_TOTALS'; payload: CartState<TConfig>['totals'] };

// Initial state
const initialState: CartState = {
  items: [],
  isOpen: false,
  totals: {
    subtotal: 0,
    total: 0,
    currency: 'USD',
  },
} as const;

// Reducer function
function cartReducer<TConfig extends ProductConfig>(
  state: CartState<TConfig>,
  action: CartAction<TConfig>
): CartState<TConfig> {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      };

    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId ? { ...item, quantity: action.payload.quantity } : item
        ),
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId ? { ...item, ...action.payload.updates } : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'SET_IS_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      };

    case 'UPDATE_TOTALS':
      return {
        ...state,
        totals: action.payload,
      };

    default:
      return state;
  }
}

// Provider Props
interface CartProviderProps<TConfig extends ProductConfig = {}> {
  children: React.ReactNode;
  config?: CartConfig<TConfig>;
}

// Provider Component
export function CartProvider<TConfig extends ProductConfig = {}>({ children, config }: CartProviderProps<TConfig>) {
  const [state, dispatch] = useReducer(cartReducer<TConfig>, initialState as CartState<TConfig>);

  // Load cart from storage on mount
  useEffect(() => {
    if (config?.storage?.type !== 'none') {
      const savedCart = loadCart<TConfig>(config?.storage?.type, config?.storage?.key);

      if (savedCart) {
        dispatch({ type: 'SET_ITEMS', payload: savedCart.items });
      }
    }
  }, [config?.storage]);

  // Update totals when items change
  useEffect(() => {
    const totals =
      config?.pricing?.calculateTotals?.(state.items) || calculateCartTotals(state.items, config?.pricing?.taxRate);

    dispatch({ type: 'UPDATE_TOTALS', payload: totals });

    // Persist cart if storage is enabled
    if (config?.storage?.type !== 'none') {
      persistCart(state, config?.storage?.type, config?.storage?.key);
    }

    // Call onCartUpdate event
    config?.events?.onCartUpdate?.(state);
  }, [state.items, config]);

  // Cart actions
  const actions: CartActions<TConfig> = useMemo(
    () => ({
      addItem: async (
        product: ShopCoreProduct<TConfig>,
        options?: {
          variant?: ShopCoreVariant<TConfig['variants']>;
          quantity?: number;
        }
      ) => {
        try {
          // Call onBeforeAddItem event
          const canAdd = await config?.events?.onBeforeAddItem?.(product, options);
          if (canAdd === false) return;

          const quantity = options?.quantity || 1;

          // Validate quantity
          if (config?.behavior?.maxQuantityPerItem || config?.behavior?.minQuantityPerItem) {
            const isValid = validateQuantity(
              quantity,
              config.behavior.minQuantityPerItem,
              config.behavior.maxQuantityPerItem
            );

            if (!isValid) {
              throw new Error('Invalid quantity');
            }
          }

          const newItem = createCartItem(product, quantity, options?.variant);

          dispatch({ type: 'ADD_ITEM', payload: newItem });

          // Merge items if enabled
          if (config?.behavior?.mergeSameItems) {
            const mergedItems = mergeCartItems([...state.items, newItem]);
            dispatch({ type: 'SET_ITEMS', payload: mergedItems });
          }

          // Call onAfterAddItem event
          config?.events?.onAfterAddItem?.(newItem);
        } catch (error) {
          config?.events?.onError?.(error as Error);
          throw error;
        }
      },

      removeItem: async (itemId: string) => {
        try {
          const canRemove = await config?.events?.onBeforeRemoveItem?.(itemId);
          if (canRemove === false) return;

          dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        } catch (error) {
          config?.events?.onError?.(error as Error);
          throw error;
        }
      },

      updateQuantity: async (itemId: string, quantity: number, options?: { validate?: boolean }) => {
        try {
          const item = state.items.find((item) => item.id === itemId);
          if (!item) throw new Error('Item not found');

          const canUpdate = await config?.events?.onBeforeUpdateQuantity?.(itemId, quantity, item.quantity);
          if (canUpdate === false) return;

          if (options?.validate !== false) {
            const isValid = validateQuantity(
              quantity,
              config?.behavior?.minQuantityPerItem,
              config?.behavior?.maxQuantityPerItem
            );

            if (!isValid) {
              throw new Error('Invalid quantity');
            }
          }

          dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { itemId, quantity },
          });
        } catch (error) {
          config?.events?.onError?.(error as Error);
          throw error;
        }
      },

      updateItem: async (itemId: string, updates: Partial<CartItem<TConfig>>) => {
        try {
          dispatch({
            type: 'UPDATE_ITEM',
            payload: { itemId, updates },
          });
        } catch (error) {
          config?.events?.onError?.(error as Error);
          throw error;
        }
      },

      clearCart: async () => {
        try {
          dispatch({ type: 'CLEAR_CART' });
        } catch (error) {
          config?.events?.onError?.(error as Error);
          throw error;
        }
      },

      openCart: () => dispatch({ type: 'SET_IS_OPEN', payload: true }),
      closeCart: () => dispatch({ type: 'SET_IS_OPEN', payload: false }),
      toggleCart: () => dispatch({ type: 'SET_IS_OPEN', payload: !state.isOpen }),
    }),
    [state, config]
  );

  const contextValue = useMemo(
    () =>
      ({
        state,
        actions,
      }) as CartContextValue<TConfig>,
    [state, actions]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

// Export the context
export { CartContext };

// Export types
export type { CartContextValue, CartProviderProps };
