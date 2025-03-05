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
 * Product categories
 */
export type ProductCategory =
  | 'electronics'
  | 'clothing'
  | 'books'
  | 'home'
  | 'beauty'
  | 'sports'
  | 'toys'
  | 'food'
  | 'other';

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
   * Detailed description of the product
   */
  description: string;

  /**
   * Current price of the product
   */
  price: number;

  /**
   * Original price before any discounts
   */
  originalPrice?: number;

  /**
   * Discount percentage (0-100)
   */
  discountPercentage?: number;

  /**
   * Main product image URL
   */
  image?: string;

  /**
   * Additional product images
   */
  images?: string[];

  /**
   * Product category
   */
  category: ProductCategory;

  /**
   * Product categories (for products that belong to multiple categories)
   */
  categories?: ProductCategory[];

  /**
   * Product tags for filtering and search
   */
  tags?: string[];

  /**
   * Stock Keeping Unit - unique identifier for inventory
   */
  sku?: string;

  /**
   * Number of items in stock
   */
  stock?: number;

  /**
   * Quantity available (alias for stock)
   */
  quantity?: number;

  /**
   * Whether the product is in stock
   */
  inStock?: boolean;

  /**
   * Product slug for URL
   */
  slug?: string;

  /**
   * Short description or summary
   */
  summary?: string;

  /**
   * Compare at price (same as original price)
   */
  compareAtPrice?: number;

  /**
   * Currency code (e.g., USD, EUR)
   */
  currency?: string;

  /**
   * Product image URL
   */
  imageUrl?: string;

  /**
   * Additional product images
   */
  additionalImages?: ProductImage[];

  /**
   * Product rating (0-5)
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
   * Whether the product is featured
   */
  featured?: boolean;

  /**
   * Whether the product is new
   */
  isNew?: boolean;

  /**
   * Whether the product is on sale
   */
  onSale?: boolean;

  /**
   * Product variants
   */
  variants?: ProductVariant[];

  /**
   * Product attributes
   */
  attributes?: Record<string, any>;

  /**
   * Product dimensions
   */
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'in';
  };

  /**
   * Product weight
   */
  weight?: {
    value: number;
    unit: 'kg' | 'g' | 'lb' | 'oz';
  };

  /**
   * Product brand
   */
  brand?: string;

  /**
   * Product manufacturer
   */
  manufacturer?: string;

  /**
   * Product warranty information
   */
  warranty?: string;

  /**
   * Product shipping information
   */
  shipping?: {
    free: boolean;
    cost?: number;
    estimatedDelivery?: string;
  };

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
   * Product metadata
   */
  metadata?: Record<string, any>;

  /**
   * Date the product was created
   */
  createdAt?: Date | string;

  /**
   * Date the product was last updated
   */
  updatedAt?: Date | string;
}

/**
 * Product variant interface
 */
export interface ProductVariant {
  /**
   * Variant ID
   */
  id: string;

  /**
   * Variant name
   */
  name: string;

  /**
   * Variant SKU
   */
  sku?: string;

  /**
   * Variant price
   */
  price?: number;

  /**
   * Compare at price (original price before discount)
   */
  compareAtPrice?: number;

  /**
   * Variant image
   */
  image?: string;

  /**
   * Variant images
   */
  images?: ProductImage[];

  /**
   * Variant attributes
   */
  attributes: Record<string, string>;

  /**
   * Variant stock
   */
  stock?: number;

  /**
   * Whether the variant is in stock
   */
  inStock?: boolean;
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
