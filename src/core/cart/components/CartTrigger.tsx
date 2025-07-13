'use client';

import React from 'react';
import { useCart } from '../hooks';

export interface CartTriggerProps {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  showItemCount?: boolean;
  showTotal?: boolean;
  renderBadge?: (count: number) => React.ReactNode;
  renderIcon?: (isOpen: boolean) => React.ReactNode;
  renderTotal?: (total: number, currency: string) => React.ReactNode;
}

export function CartTrigger({
  children,
  className = '',
  icon,
  showItemCount = true,
  showTotal = false,
  renderBadge,
  renderIcon,
  renderTotal,
}: CartTriggerProps) {
  const { isOpen, toggle, itemCount, totals } = useCart();

  // Default badge render function
  const defaultRenderBadge = (count: number) => {
    if (count === 0) return null;
    return (
      <span
        className='absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full'
        style={{ minWidth: '1.25rem' }}
      >
        {count}
      </span>
    );
  };

  // Default icon render function
  const defaultRenderIcon = (isOpen: boolean) => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-6 h-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
        />
      </svg>
    );
  };

  // Default total render function
  const defaultRenderTotal = (total: number, currency: string) => {
    return (
      <span className='ml-2'>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(total)}
      </span>
    );
  };

  return (
    <button
      type='button'
      onClick={toggle}
      className={`relative inline-flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 focus:outline-none ${className}`}
      aria-label='Cart'
    >
      {children || (
        <>
          {renderIcon?.(isOpen) || icon || defaultRenderIcon(isOpen)}
          {showItemCount && (renderBadge?.(itemCount) || defaultRenderBadge(itemCount))}
          {showTotal &&
            (renderTotal?.(totals.total, totals.currency) || defaultRenderTotal(totals.total, totals.currency))}
        </>
      )}
    </button>
  );
}
