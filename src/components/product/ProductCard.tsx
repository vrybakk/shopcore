'use client';

import React from 'react';
import { Product } from '../../core/types/product';
import { usePrice } from '../../hooks/usePrice';

/**
 * Props for the ProductCard component
 */
export interface ProductCardProps {
  /**
   * The product to display
   */
  product: Product;

  /**
   * Whether to show the product description
   */
  showDescription?: boolean;

  /**
   * Maximum number of characters to show in the description
   */
  descriptionLength?: number;

  /**
   * Whether to show the product rating
   */
  showRating?: boolean;

  /**
   * Whether to show the "Add to Cart" button
   */
  showAddToCart?: boolean;

  /**
   * Whether to show the "Add to Wishlist" button
   */
  showAddToWishlist?: boolean;

  /**
   * Callback when the product is clicked
   */
  onProductClick?: (product: Product) => void;

  /**
   * Callback when the "Add to Cart" button is clicked
   */
  onAddToCart?: (product: Product) => void;

  /**
   * Callback when the "Add to Wishlist" button is clicked
   */
  onAddToWishlist?: (product: Product) => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional props to pass to the component
   */
  [key: string]: any;
}

/**
 * ProductCard component
 *
 * Displays a product card with image, name, price, and optional description and actions.
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={product}
 *   showDescription
 *   showRating
 *   showAddToCart
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 */
export function ProductCard({
  product,
  showDescription = false,
  descriptionLength = 100,
  showRating = false,
  showAddToCart = false,
  showAddToWishlist = false,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  className = '',
  ...props
}: ProductCardProps) {
  // Format the price
  const { formattedPrice, formattedBasePrice, hasDiscount, discountPercentage } = usePrice({
    amount: product.price,
    baseAmount: product.compareAtPrice,
    currency: product.currency,
  });

  // Get the primary image or the first image
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  // Truncate the description if needed
  const truncatedDescription =
    product.description && showDescription
      ? product.description.length > descriptionLength
        ? `${product.description.substring(0, descriptionLength)}...`
        : product.description
      : null;

  // Handle product click
  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product click
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the product click
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <div className={`shopcore-product-card ${className}`} onClick={handleProductClick} {...props}>
      <div className='shopcore-product-card-image'>
        {primaryImage && (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            width={primaryImage.width}
            height={primaryImage.height}
          />
        )}
        {hasDiscount && <div className='shopcore-product-card-discount'>{discountPercentage}% OFF</div>}
      </div>

      <div className='shopcore-product-card-content'>
        <h3 className='shopcore-product-card-title'>{product.name}</h3>

        {showRating && product.rating !== undefined && (
          <div className='shopcore-product-card-rating'>
            <span className='shopcore-product-card-rating-stars'>
              {/* Render stars based on rating */}
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`shopcore-product-card-rating-star ${i < Math.floor(product.rating!) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </span>
            <span className='shopcore-product-card-rating-count'>({product.reviewCount || 0})</span>
          </div>
        )}

        <div className='shopcore-product-card-price'>
          <span className='shopcore-product-card-current-price'>{formattedPrice}</span>
          {hasDiscount && <span className='shopcore-product-card-original-price'>{formattedBasePrice}</span>}
        </div>

        {truncatedDescription && <p className='shopcore-product-card-description'>{truncatedDescription}</p>}

        <div className='shopcore-product-card-actions'>
          {showAddToCart && (
            <button className='shopcore-product-card-add-to-cart' onClick={handleAddToCart} disabled={!product.inStock}>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}

          {showAddToWishlist && (
            <button className='shopcore-product-card-add-to-wishlist' onClick={handleAddToWishlist}>
              ♡
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
