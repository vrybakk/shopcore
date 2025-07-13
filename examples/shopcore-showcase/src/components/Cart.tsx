'use client';

import { CartItemComponent, useCart } from 'shopcore';

export default function Cart() {
  const { items, isOpen, close, totals } = useCart();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      <div className='absolute inset-0 bg-black bg-opacity-50' onClick={close} />
      <div className='absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='px-4 py-6 bg-gray-50 sm:px-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-medium text-gray-900'>Shopping Cart</h2>
              <button type='button' className='text-gray-400 hover:text-gray-500' onClick={close}>
                <span className='sr-only'>Close cart</span>
                <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart items */}
          <div className='flex-1 px-4 py-6 sm:px-6 overflow-auto'>
            {items.length === 0 ? (
              <p className='text-center text-gray-500'>Your cart is empty</p>
            ) : (
              <div className='space-y-4'>
                {items.map((item) => (
                  <CartItemComponent key={item.id} itemId={item.id} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='border-t border-gray-200 px-4 py-6 sm:px-6'>
            <div className='flex justify-between text-base font-medium text-gray-900'>
              <p>Subtotal</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: totals.currency,
                }).format(totals.subtotal)}
              </p>
            </div>
            <p className='mt-0.5 text-sm text-gray-500'>Shipping and taxes calculated at checkout.</p>
            <div className='mt-6'>
              <button
                type='button'
                className='w-full bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700'
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
