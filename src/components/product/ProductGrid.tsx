'use client';

import React from 'react';
import { Product } from '../../core/types/product';
import { ProductCard, ProductCardProps } from './ProductCard';

/**
 * Props for the ProductGrid component
 */
export interface ProductGridProps {
  /**
   * The products to display
   */
  products: Product[];

  /**
   * Number of columns in the grid
   */
  columns?: number;

  /**
   * Gap between grid items (in pixels or CSS value)
   */
  gap?: string | number;

  /**
   * Props to pass to each ProductCard
   */
  productCardProps?: Omit<ProductCardProps, 'product'>;

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
 * ProductGrid component
 * 
 * Displays a grid of product cards.
 * 
 * @example
 * ```tsx
 * <ProductGrid
 *   products={products}
 *   columns={3}
 *   gap={16}
 *   productCardProps={{
 *     showDescription: true,
 *     showRating: true,
 *     showAddToCart: true,
 *     onAddToCart: handleAddToCart,
 *   }}
 * />
 * ```
 */
export function ProductGrid({
  products,
  columns = 3,
  gap = 16,
  productCardProps = {},
  className = '',
  ...props
}: ProductGridProps) {
  // Convert gap to string with 'px' if it's a number
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

  // Create grid style
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gapValue,
  };

  return (
    <div
      className={`shopcore-product-grid ${className}`}
      style={gridStyle}
      {...props}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          {...productCardProps}
        />
      ))}
    </div>
  );
} 