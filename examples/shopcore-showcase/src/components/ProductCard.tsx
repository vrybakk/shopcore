'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart, useShopcoreConfig } from 'shopcore';
import { ShopCoreProduct } from '../../../../dist/core/cart/types';

interface ProductCardProps {
  product: ShopCoreProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { defaultCurrency, defaultLocale } = useShopcoreConfig();
  const { addItem } = useCart();

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(defaultLocale || 'en-US', {
      style: 'currency',
      currency: defaultCurrency || 'USD',
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    try {
      await addItem(product);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className='group block'>
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
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
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
          <button
            onClick={handleAddToCart}
            className='mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors'
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
