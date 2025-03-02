'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useProducts, useShopcoreConfig } from 'shopcore';

export default function ProductsPage() {
  const { products, loading } = useProducts();
  const { defaultCurrency, defaultLocale } = useShopcoreConfig();

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(defaultLocale || 'en-US', {
      style: 'currency',
      currency: defaultCurrency || 'USD',
    }).format(price);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h1 className='text-3xl font-bold mb-8'>All Products</h1>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className='group'>
              <div className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                {product.image && (
                  <div className='aspect-square overflow-hidden'>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={500}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                )}
                <div className='p-4'>
                  <h3 className='font-medium text-lg group-hover:text-blue-600 transition-colors'>{product.name}</h3>
                  <div className='mt-2'>
                    {product.originalPrice && product.originalPrice > product.price ? (
                      <div className='flex items-center gap-2'>
                        <span className='text-lg font-bold'>{formatPrice(product.price)}</span>
                        <span className='text-sm text-gray-500 line-through'>{formatPrice(product.originalPrice)}</span>
                      </div>
                    ) : (
                      <span className='text-lg font-bold'>{formatPrice(product.price)}</span>
                    )}
                  </div>
                  {product.rating && (
                    <div className='flex items-center mt-2'>
                      <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns='http://www.w3.org/2000/svg'
                            className={`h-4 w-4 ${i < Math.floor(product.rating as number) ? 'text-yellow-400' : 'text-gray-300'}`}
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                      {product.reviewCount !== undefined && (
                        <span className='ml-1 text-sm text-gray-600'>({product.reviewCount})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
