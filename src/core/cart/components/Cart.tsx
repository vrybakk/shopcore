'use client';

import React, { useEffect, useRef } from 'react';
import { useCart } from '../hooks';
import { CartItem as CartItemType, ProductConfig } from '../types';

export interface CartProps<TConfig extends ProductConfig = {}> {
  className?: string;
  width?: string;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderItem?: (item: CartItemType<TConfig>) => React.ReactNode;
}

export function Cart<TConfig extends ProductConfig = {}>({
  className = '',
  width = '400px',
  renderHeader,
  renderFooter,
  renderEmpty,
  renderItem,
}: CartProps<TConfig>) {
  const { isOpen, close, items, totals } = useCart<TConfig>();
  const overlayRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);

  // Default header render function
  const defaultRenderHeader = () => (
    <div className='flex items-center justify-between p-4 border-b'>
      <h2 className='text-lg font-semibold'>Shopping Cart</h2>
      <button
        type='button'
        onClick={close}
        className='p-2 -m-2 text-gray-400 hover:text-gray-500'
        aria-label='Close cart'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
      </button>
    </div>
  );

  // Default empty render function
  const defaultRenderEmpty = () => (
    <div className='flex flex-col items-center justify-center flex-1 p-4'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1}
        stroke='currentColor'
        className='w-16 h-16 text-gray-400 mb-4'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
        />
      </svg>
      <p className='text-gray-500'>Your cart is empty</p>
    </div>
  );

  // Default footer render function
  const defaultRenderFooter = () => (
    <div className='border-t p-4 space-y-4'>
      <div className='space-y-1'>
        <div className='flex justify-between text-sm'>
          <span>Subtotal</span>
          <span>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: totals.currency,
            }).format(totals.subtotal)}
          </span>
        </div>
        {totals.tax !== undefined && (
          <div className='flex justify-between text-sm'>
            <span>Tax</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: totals.currency,
              }).format(totals.tax)}
            </span>
          </div>
        )}
        <div className='flex justify-between font-semibold'>
          <span>Total</span>
          <span>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: totals.currency,
            }).format(totals.total)}
          </span>
        </div>
      </div>
      <button
        type='button'
        className='w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400'
      >
        Checkout
      </button>
    </div>
  );

  // Default item render function
  const defaultRenderItem = (item: CartItemType<TConfig>) => (
    <div key={item.id} className='flex items-center py-4 px-4 hover:bg-gray-50'>
      <div className='flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden'>
        {/* Add image here if available in your product type */}
        <div className='w-full h-full bg-gray-200' />
      </div>
      <div className='ml-4 flex-1'>
        <div className='flex justify-between'>
          <div>
            <h3 className='text-sm font-medium'>{item.product.name}</h3>
            {item.variant && (
              <p className='mt-1 text-sm text-gray-500'>
                {Object.entries(item.variant.attributes || {})
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </p>
            )}
          </div>
          <p className='text-sm font-medium'>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: item.price.currency,
            }).format(item.price.amount)}
          </p>
        </div>
        <div className='mt-1 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>Qty {item.quantity}</div>
          <button type='button' className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity'
      style={{
        animation: 'fadeIn 200ms ease-out',
      }}
    >
      <div
        ref={cartRef}
        className={`fixed inset-y-0 right-0 flex flex-col bg-white shadow-xl ${className}`}
        style={{
          width,
          animation: 'slideIn 300ms ease-out',
        }}
      >
        {/* Header */}
        {renderHeader?.() || defaultRenderHeader()}

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
          {items.length === 0
            ? renderEmpty?.() || defaultRenderEmpty()
            : items.map((item) => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
        </div>

        {/* Footer */}
        {items.length > 0 && (renderFooter?.() || defaultRenderFooter())}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
