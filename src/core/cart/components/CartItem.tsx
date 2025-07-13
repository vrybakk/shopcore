'use client';

import React from 'react';
import { useCart } from '../hooks';
import { CartItem as CartItemType, ProductConfig } from '../types';

export interface CartItemProps<TConfig extends ProductConfig = {}> {
  itemId: string;
  className?: string;
  showImage?: boolean;
  showQuantityControls?: boolean;
  showRemoveButton?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  renderImage?: (item: CartItemType<TConfig>) => React.ReactNode;
  renderDetails?: (item: CartItemType<TConfig>) => React.ReactNode;
  renderQuantity?: (
    item: CartItemType<TConfig>,
    updateQuantity: (quantity: number) => Promise<void>
  ) => React.ReactNode;
  renderPrice?: (item: CartItemType<TConfig>) => React.ReactNode;
  renderRemove?: (item: CartItemType<TConfig>, remove: () => Promise<void>) => React.ReactNode;
}

export function CartItem<TConfig extends ProductConfig = {}>({
  itemId,
  className = '',
  showImage = true,
  showQuantityControls = true,
  showRemoveButton = true,
  minQuantity = 1,
  maxQuantity = 99,
  renderImage,
  renderDetails,
  renderQuantity,
  renderPrice,
  renderRemove,
}: CartItemProps<TConfig>) {
  const { manageItem } = useCart<TConfig>();
  const manager = manageItem(itemId);
  if (!manager) return null;

  const { item, updateQuantity, remove } = manager;

  // Default image render function
  const defaultRenderImage = (item: CartItemType<TConfig>) => (
    <div className='flex-shrink-0 w-24 h-24 border rounded-md overflow-hidden'>
      {/* Add image here if available in your product type */}
      <div className='w-full h-full bg-gray-200' />
    </div>
  );

  // Default details render function
  const defaultRenderDetails = (item: CartItemType<TConfig>) => (
    <div className='flex-1'>
      <h3 className='text-sm font-medium text-gray-900'>{item.product.name}</h3>
      {item.variant && (
        <p className='mt-1 text-sm text-gray-500'>
          {Object.entries(item.variant.attributes || {})
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}
        </p>
      )}
    </div>
  );

  // Default quantity render function
  const defaultRenderQuantity = (item: CartItemType<TConfig>, updateQuantity: (quantity: number) => Promise<void>) => (
    <div className='flex items-center border rounded-md'>
      <button
        type='button'
        className='px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50'
        onClick={() => updateQuantity(item.quantity - 1)}
        disabled={item.quantity <= minQuantity}
      >
        -
      </button>
      <span className='px-2 py-1 text-sm text-center min-w-[2rem]'>{item.quantity}</span>
      <button
        type='button'
        className='px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50'
        onClick={() => updateQuantity(item.quantity + 1)}
        disabled={item.quantity >= maxQuantity}
      >
        +
      </button>
    </div>
  );

  // Default price render function
  const defaultRenderPrice = (item: CartItemType<TConfig>) => (
    <div className='text-sm font-medium text-gray-900'>
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: item.price.currency,
      }).format(item.price.amount * item.quantity)}
    </div>
  );

  // Default remove render function
  const defaultRenderRemove = (item: CartItemType<TConfig>, remove: () => Promise<void>) => (
    <button type='button' onClick={remove} className='text-sm font-medium text-red-600 hover:text-red-500'>
      Remove
    </button>
  );

  return (
    <div className={`flex items-center gap-4 py-4 ${className}`}>
      {/* Image */}
      {showImage && (renderImage?.(item) || defaultRenderImage(item))}

      {/* Details */}
      {renderDetails?.(item) || defaultRenderDetails(item)}

      {/* Quantity */}
      {showQuantityControls && (
        <div className='flex items-center gap-2'>
          {renderQuantity?.(item, updateQuantity) || defaultRenderQuantity(item, updateQuantity)}
        </div>
      )}

      {/* Price */}
      {renderPrice?.(item) || defaultRenderPrice(item)}

      {/* Remove button */}
      {showRemoveButton && (
        <div className='ml-4'>{renderRemove?.(item, remove) || defaultRenderRemove(item, remove)}</div>
      )}
    </div>
  );
}
