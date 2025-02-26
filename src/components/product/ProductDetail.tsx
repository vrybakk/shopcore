'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '../../core/types/product';
import { usePrice } from '../../hooks/usePrice';

/**
 * Props for the ProductDetail component
 */
export interface ProductDetailProps {
  /**
   * The product to display
   */
  product: Product;

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
   * Callback when the "Add to Cart" button is clicked
   */
  onAddToCart?: (product: Product, variant?: ProductVariant, quantity?: number) => void;

  /**
   * Callback when the "Add to Wishlist" button is clicked
   */
  onAddToWishlist?: (product: Product, variant?: ProductVariant) => void;

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
 * ProductDetail component
 * 
 * Displays detailed information about a product, including images, description,
 * variants, and actions.
 * 
 * @example
 * ```tsx
 * <ProductDetail
 *   product={product}
 *   showRating
 *   showAddToCart
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 */
export function ProductDetail({
  product,
  showRating = true,
  showAddToCart = true,
  showAddToWishlist = true,
  onAddToCart,
  onAddToWishlist,
  className = '',
  ...props
}: ProductDetailProps) {
  // State for selected variant and quantity
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  // Get the current price (from variant if selected, otherwise from product)
  const currentPrice = selectedVariant?.price ?? product.price;
  const compareAtPrice = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const currency = product.currency;

  // Format the price
  const { formattedPrice, formattedBasePrice, hasDiscount, discountPercentage } = usePrice({
    amount: currentPrice,
    baseAmount: compareAtPrice,
    currency,
  });

  // Get all images (from variant if selected, otherwise from product)
  const images = selectedVariant?.images?.length ? selectedVariant.images : product.images || [];
  
  // State for selected image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = images[selectedImageIndex];

  // Check if the product or selected variant is in stock
  const inStock = selectedVariant ? selectedVariant.inStock : (product.inStock ?? true);

  // Handle variant change
  const handleVariantChange = (variantId: string) => {
    const variant = product.variants?.find(v => v.id === variantId);
    setSelectedVariant(variant);
    // Reset selected image when variant changes
    setSelectedImageIndex(0);
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart && inStock) {
      onAddToCart(product, selectedVariant, quantity);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product, selectedVariant);
    }
  };

  return (
    <div className={`shopcore-product-detail ${className}`} {...props}>
      <div className="shopcore-product-detail-gallery">
        {/* Main image */}
        <div className="shopcore-product-detail-main-image">
          {selectedImage && (
            <img
              src={selectedImage.url}
              alt={selectedImage.alt || product.name}
              width={selectedImage.width}
              height={selectedImage.height}
            />
          )}
          {hasDiscount && (
            <div className="shopcore-product-detail-discount">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Thumbnail images */}
        {images.length > 1 && (
          <div className="shopcore-product-detail-thumbnails">
            {images.map((image, index) => (
              <button
                key={image.id}
                className={`shopcore-product-detail-thumbnail ${
                  index === selectedImageIndex ? 'active' : ''
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${product.name} - Image ${index + 1}`}
                  width={image.width ? image.width / 4 : undefined}
                  height={image.height ? image.height / 4 : undefined}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="shopcore-product-detail-info">
        <h1 className="shopcore-product-detail-title">{product.name}</h1>

        {/* Rating */}
        {showRating && product.rating !== undefined && (
          <div className="shopcore-product-detail-rating">
            <span className="shopcore-product-detail-rating-stars">
              {/* Render stars based on rating */}
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`shopcore-product-detail-rating-star ${
                    i < Math.floor(product.rating!) ? 'filled' : ''
                  }`}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="shopcore-product-detail-rating-value">
              {product.rating.toFixed(1)}
            </span>
            <span className="shopcore-product-detail-rating-count">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="shopcore-product-detail-price">
          <span className="shopcore-product-detail-current-price">
            {formattedPrice}
          </span>
          {hasDiscount && (
            <span className="shopcore-product-detail-original-price">
              {formattedBasePrice}
            </span>
          )}
          {hasDiscount && (
            <span className="shopcore-product-detail-discount-percentage">
              {discountPercentage}% off
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="shopcore-product-detail-description">
            <p>{product.description}</p>
          </div>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="shopcore-product-detail-variants">
            <label htmlFor="variant-select">Variants:</label>
            <select
              id="variant-select"
              className="shopcore-product-detail-variant-select"
              value={selectedVariant?.id}
              onChange={(e) => handleVariantChange(e.target.value)}
            >
              {product.variants.map((variant) => (
                <option
                  key={variant.id}
                  value={variant.id}
                  disabled={!variant.inStock}
                >
                  {variant.name} {!variant.inStock && '(Out of Stock)'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity */}
        {showAddToCart && inStock && (
          <div className="shopcore-product-detail-quantity">
            <label htmlFor="quantity-input">Quantity:</label>
            <input
              id="quantity-input"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="shopcore-product-detail-quantity-input"
            />
          </div>
        )}

        {/* Actions */}
        <div className="shopcore-product-detail-actions">
          {showAddToCart && (
            <button
              className="shopcore-product-detail-add-to-cart"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}

          {showAddToWishlist && (
            <button
              className="shopcore-product-detail-add-to-wishlist"
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>
          )}
        </div>

        {/* Additional information */}
        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className="shopcore-product-detail-attributes">
            <h3>Product Details</h3>
            <ul>
              {Object.entries(product.attributes).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 