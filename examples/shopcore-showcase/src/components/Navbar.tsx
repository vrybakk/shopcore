'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from 'shopcore';
import Cart from './Cart';

export default function Navbar() {
  const pathname = usePathname();
  const { toggle, itemCount } = useCart();

  return (
    <>
      <nav className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <div className='flex-shrink-0 flex items-center'>
                <Link href='/' className='text-xl font-bold text-blue-600'>
                  Shopcore
                </Link>
              </div>
              <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                <Link
                  href='/'
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href='/products'
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/products'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Products
                </Link>
              </div>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:items-center'>
              <button
                type='button'
                className='p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                onClick={toggle}
              >
                <span className='sr-only'>View cart</span>
                <div className='relative'>
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className='absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white'>
                      {itemCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                type='button'
                className='ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                <span className='sr-only'>View wishlist</span>
                <svg
                  className='h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Cart />
    </>
  );
}
