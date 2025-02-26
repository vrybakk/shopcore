/**
 * Product Types
 * 
 * This file contains all the type definitions for products in Shopcore.
 */

/**
 * Product image interface
 */
export interface ProductImage {
  /**
   * Unique identifier for the image
   */
  id: string;

  /**
   * URL of the image
   */
  url: string;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Whether this is the primary image
   */
  isPrimary?: boolean;

  /**
   * Width of the image in pixels
   */
  width?: number;

  /**
   * Height of the image in pixels
   */
  height?: number;
}

/**
 * Product variant interface
 */
export interface ProductVariant {
  /**
   * Unique identifier for the variant
   */
  id: string;

  /**
   * Name of the variant
   */
  name: string;

  /**
   * SKU (Stock Keeping Unit) of the variant
   */
  sku?: string;

  /**
   * Price of the variant
   */
  price: number;

  /**
   * Compare at price (original price before discount)
   */
  compareAtPrice?: number;

  /**
   * Whether the variant is in stock
   */
  inStock: boolean;

  /**
   * Available quantity of the variant
   */
  quantity?: number;

  /**
   * Options specific to this variant (e.g., color, size)
   */
  options?: Record<string, string>;

  /**
   * Images specific to this variant
   */
  images?: ProductImage[];
}

/**
 * Product review interface
 */
export interface ProductReview {
  /**
   * Unique identifier for the review
   */
  id: string;

  /**
   * Author of the review
   */
  author: string;

  /**
   * Rating (1-5)
   */
  rating: number;

  /**
   * Title of the review
   */
  title?: string;

  /**
   * Content of the review
   */
  content: string;

  /**
   * Date the review was created
   */
  createdAt: Date | string;

  /**
   * Whether the review is verified
   */
  isVerified?: boolean;
}

/**
 * Product interface
 */
export interface Product {
  /**
   * Unique identifier for the product
   */
  id: string;

  /**
   * Name of the product
   */
  name: string;

  /**
   * Slug for the product URL
   */
  slug?: string;

  /**
   * Description of the product
   */
  description?: string;

  /**
   * Short description or summary
   */
  summary?: string;

  /**
   * Base price of the product
   */
  price: number;

  /**
   * Compare at price (original price before discount)
   */
  compareAtPrice?: number;

  /**
   * Currency code (e.g., USD, EUR)
   */
  currency?: string;

  /**
   * Whether the product is in stock
   */
  inStock?: boolean;

  /**
   * Available quantity
   */
  quantity?: number;

  /**
   * Categories the product belongs to
   */
  categories?: string[];

  /**
   * Tags associated with the product
   */
  tags?: string[];

  /**
   * Images of the product
   */
  images?: ProductImage[];

  /**
   * Variants of the product
   */
  variants?: ProductVariant[];

  /**
   * Average rating (1-5)
   */
  rating?: number;

  /**
   * Number of reviews
   */
  reviewCount?: number;

  /**
   * Reviews of the product
   */
  reviews?: ProductReview[];

  /**
   * Related products
   */
  relatedProducts?: string[];

  /**
   * SEO metadata
   */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  /**
   * Custom attributes
   */
  attributes?: Record<string, any>;

  /**
   * Date the product was created
   */
  createdAt?: Date | string;

  /**
   * Date the product was last updated
   */
  updatedAt?: Date | string;
} 