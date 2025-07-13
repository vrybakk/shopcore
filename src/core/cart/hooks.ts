import { useContext, useMemo } from 'react';
import { CartContext } from './context';
import { CartItem, ProductConfig } from './types';

/**
 * Main cart hook that provides all cart functionality
 */
export function useCart<TConfig extends ProductConfig = {}>() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { state, actions } = context;

  return useMemo(
    () => ({
      // Cart state
      items: state.items,
      isEmpty: state.items.length === 0,
      isOpen: state.isOpen,
      totals: state.totals,
      itemCount: state.items.reduce((total, item) => total + item.quantity, 0),

      // Cart visibility
      open: actions.openCart,
      close: actions.closeCart,
      toggle: actions.toggleCart,

      // Cart operations
      addItem: actions.addItem,
      removeItem: actions.removeItem,
      updateQuantity: actions.updateQuantity,
      updateItem: actions.updateItem,
      clearCart: actions.clearCart,

      // Helper functions
      getItem: (itemId: string) => state.items.find((item) => item.id === itemId),

      isInCart: (productId: string, variantId?: string) => {
        return state.items.some((item) => {
          if (variantId) {
            return item.product.id === productId && item.variant?.id === variantId;
          }
          return item.product.id === productId;
        });
      },

      getQuantityInCart: (productId: string, variantId?: string) => {
        return state.items.reduce((total, item) => {
          if (variantId) {
            return item.product.id === productId && item.variant?.id === variantId ? total + item.quantity : total;
          }
          return item.product.id === productId ? total + item.quantity : total;
        }, 0);
      },

      // Simplified item management
      manageItem: (itemId: string) => {
        const item = state.items.find((item) => item.id === itemId);
        if (!item) return null;

        return {
          item,
          updateQuantity: (quantity: number) => actions.updateQuantity(itemId, quantity),
          remove: () => actions.removeItem(itemId),
          update: (updates: Partial<CartItem<TConfig>>) => actions.updateItem(itemId, updates),
        };
      },
    }),
    [state, actions]
  );
}

// Export a type for the return value of useCart
export type UseCartReturn<TConfig extends ProductConfig = {}> = ReturnType<typeof useCart<TConfig>>;

export interface CartTotals {
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  currency: string;
}
