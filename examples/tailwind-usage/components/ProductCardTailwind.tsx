import React from 'react';
import { Product } from '../../../src/core/types/product';

interface ProductCardTailwindProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

/**
 * Example ProductCard component using Shopcore Tailwind plugin
 *
 * This component demonstrates how to use the Shopcore Tailwind plugin
 * to style a product card component.
 */
export function ProductCardTailwind({ product, onAddToCart, onAddToWishlist }: ProductCardTailwindProps) {
  const { name, price, compareAtPrice, description, images } = product;

  // Calculate discount percentage if there's a compare at price
  const discountPercentage = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  // Get the primary image or the first image
  const primaryImage = images?.find((img) => img.isPrimary) || images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
  };

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-shopcore-medium border border-shopcore-border bg-shopcore-background transition-all hover:shadow-lg hover:-translate-y-1'>
      {/* Product image */}
      <div className='relative aspect-square overflow-hidden'>
        {primaryImage && (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || name}
            className='h-full w-full object-cover transition-transform group-hover:scale-105'
          />
        )}

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className='absolute right-2 top-2 rounded-shopcore-small bg-shopcore-accent px-2 py-1 text-xs font-semibold text-white'>
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Product content */}
      <div className='flex flex-1 flex-col p-4'>
        <h3 className='mb-1 text-lg font-semibold text-shopcore-text'>{name}</h3>

        {/* Price */}
        <div className='mb-2 flex items-center'>
          <span className='text-lg font-semibold text-shopcore-text'>${price.toFixed(2)}</span>

          {compareAtPrice && compareAtPrice > price && (
            <span className='ml-2 text-sm text-shopcore-muted line-through'>${compareAtPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Description */}
        {description && <p className='mb-4 text-sm text-shopcore-muted line-clamp-2'>{description}</p>}

        {/* Actions */}
        <div className='mt-auto flex items-center justify-between'>
          {/* Using the Shopcore button utility classes */}
          <button onClick={handleAddToCart} className='shopcore-btn shopcore-btn-primary'>
            Add to Cart
          </button>

          <button
            onClick={handleAddToWishlist}
            className='shopcore-btn shopcore-btn-outline ml-2 p-2'
            aria-label='Add to wishlist'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-5 w-5'
            >
              <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Example usage:
 *
 * ```tsx
 * import { ProductCardTailwind } from './components/ProductCardTailwind';
 *
 * function ProductList({ products }) {
 *   const handleAddToCart = (product) => {
 *     console.log('Adding to cart:', product);
 *   };
 *
 *   const handleAddToWishlist = (product) => {
 *     console.log('Adding to wishlist:', product);
 *   };
 *
 *   return (
 *     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
 *       {products.map((product) => (
 *         <ProductCardTailwind
 *           key={product.id}
 *           product={product}
 *           onAddToCart={handleAddToCart}
 *           onAddToWishlist={handleAddToWishlist}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
