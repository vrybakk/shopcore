'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProduct, useShopcoreConfig } from 'shopcore';

export default function ProductPage() {
  const params = useParams();
  const productId = typeof params.id === 'string' ? params.id : '';

  const { product, loading } = useProduct(productId);
  const { defaultCurrency, defaultLocale } = useShopcoreConfig();

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(defaultLocale || 'en-US', {
      style: 'currency',
      currency: defaultCurrency || 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-8'>
        <h1 className='text-2xl font-bold mb-4'>Product Not Found</h1>
        <p className='text-gray-600 mb-8'>
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href='/' className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors'>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-8'>
      <div className='w-full max-w-7xl'>
        <Link href='/' className='inline-flex items-center text-blue-500 hover:text-blue-700 mb-8'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-1' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
          Back to Products
        </Link>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Product Image */}
          <div className='rounded-lg overflow-hidden border'>
            {product.image ? (
              <img src={product.image} alt={product.name} className='w-full h-auto object-cover' />
            ) : (
              <div className='bg-gray-200 w-full aspect-square flex items-center justify-center'>
                <span className='text-gray-400'>No image available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>

            <div className='mb-4'>
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className='flex items-center gap-3'>
                  <span className='text-2xl font-bold'>{formatPrice(product.price)}</span>
                  <span className='text-lg text-gray-500 line-through'>{formatPrice(product.originalPrice)}</span>
                  <span className='bg-red-100 text-red-800 text-sm px-2 py-1 rounded'>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className='text-2xl font-bold'>{formatPrice(product.price)}</span>
              )}
            </div>

            {product.rating && (
              <div className='flex items-center mb-4'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns='http://www.w3.org/2000/svg'
                      className={`h-5 w-5 ${i < Math.floor(product.rating as number) ? 'text-yellow-400' : 'text-gray-300'}`}
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <span className='ml-2 text-gray-600'>
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            <p className='text-gray-700 mb-6'>{product.description}</p>

            {product.inStock ? (
              <div className='text-green-600 mb-4 flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                In Stock ({product.stock} available)
              </div>
            ) : (
              <div className='text-red-600 mb-4 flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                Out of Stock
              </div>
            )}

            <div className='flex gap-4 mb-8'>
              <button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex-1'>
                Add to Cart
              </button>
              <button className='border border-gray-300 hover:border-gray-400 px-4 py-3 rounded-md transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
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

            {/* Additional Info */}
            <div className='border-t pt-6'>
              <div className='grid grid-cols-2 gap-4'>
                {product.sku && (
                  <div>
                    <span className='text-gray-500'>SKU:</span> {product.sku}
                  </div>
                )}
                {product.brand && (
                  <div>
                    <span className='text-gray-500'>Brand:</span> {product.brand}
                  </div>
                )}
                {product.category && (
                  <div>
                    <span className='text-gray-500'>Category:</span> {product.category}
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <span className='text-gray-500'>Warranty:</span> {product.warranty}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
