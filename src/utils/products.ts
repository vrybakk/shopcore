import { ShopcoreConfig } from '../core/types/config';
import { Product, ProductCategory } from '../core/types/product';
import { createLogger } from './logger';

// Create a logger instance
const logger = createLogger({ debug: true, mode: 'development' });

/**
 * Interface for product filtering options
 */
export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  attributes?: Record<string, string | number | boolean>;
  tags?: string[];
}

/**
 * Interface for product sorting options
 */
export interface ProductSortOptions {
  field: 'price' | 'name' | 'createdAt' | 'rating' | 'popularity';
  direction: 'asc' | 'desc';
}

/**
 * Interface for product search options
 */
export interface ProductSearchOptions {
  query: string;
  fields?: Array<'name' | 'description' | 'sku' | 'tags'>;
}

/**
 * Interface for product pagination options
 */
export interface ProductPaginationOptions {
  page: number;
  limit: number;
}

/**
 * Interface for product fetch options
 */
export interface ProductFetchOptions {
  filters?: ProductFilterOptions;
  sort?: ProductSortOptions;
  search?: ProductSearchOptions;
  pagination?: ProductPaginationOptions;
}

/**
 * Interface for product fetch result
 */
export interface ProductFetchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API configuration interface
 */
interface ApiConfig {
  baseUrl: string;
  endpoints: {
    products: string;
    [key: string]: string;
  };
  headers?: Record<string, string>;
}

/**
 * Extended mock configuration
 */
interface ExtendedMockConfig {
  enabled: boolean;
  fallbackOnError?: boolean;
  data?: {
    products?: Product[];
    [key: string]: any;
  };
}

/**
 * Fetches products based on the provided options
 *
 * @param config - The Shopcore configuration
 * @param options - The fetch options
 * @returns A promise that resolves to the fetch result
 */
export async function fetchProducts(
  config: ShopcoreConfig,
  options: ProductFetchOptions = {}
): Promise<ProductFetchResult> {
  try {
    logger.info('Fetching products', { options });

    // Use the mock system if enabled
    if (config.mock?.enabled) {
      return fetchMockProducts(config, options);
    }

    // Check if API configuration exists
    const apiConfig = (config as any).api as ApiConfig | undefined;
    if (!apiConfig) {
      throw new Error('API configuration is missing');
    }

    // Use the API endpoint from config
    const endpoint = `${apiConfig.baseUrl}${apiConfig.endpoints.products}`;

    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add pagination
    if (options.pagination) {
      queryParams.append('page', options.pagination.page.toString());
      queryParams.append('limit', options.pagination.limit.toString());
    }

    // Add sorting
    if (options.sort) {
      queryParams.append('sort', options.sort.field);
      queryParams.append('direction', options.sort.direction);
    }

    // Add search
    if (options.search) {
      queryParams.append('query', options.search.query);
      if (options.search.fields) {
        queryParams.append('searchFields', options.search.fields.join(','));
      }
    }

    // Add filters
    if (options.filters) {
      if (options.filters.category) {
        queryParams.append('category', options.filters.category);
      }

      if (options.filters.minPrice !== undefined) {
        queryParams.append('minPrice', options.filters.minPrice.toString());
      }

      if (options.filters.maxPrice !== undefined) {
        queryParams.append('maxPrice', options.filters.maxPrice.toString());
      }

      if (options.filters.inStock !== undefined) {
        queryParams.append('inStock', options.filters.inStock.toString());
      }

      if (options.filters.tags && options.filters.tags.length > 0) {
        queryParams.append('tags', options.filters.tags.join(','));
      }

      // Add custom attributes
      if (options.filters.attributes) {
        Object.entries(options.filters.attributes).forEach(([key, value]) => {
          queryParams.append(`attr_${key}`, value.toString());
        });
      }
    }

    // Build the URL
    const url = `${endpoint}?${queryParams.toString()}`;

    // Fetch the products
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(apiConfig.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      products: data.products,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    };
  } catch (error) {
    logger.error('Error fetching products', { error });

    // Fallback to mock data if configured
    const extendedMock = config.mock as ExtendedMockConfig | undefined;
    if (extendedMock?.fallbackOnError) {
      logger.info('Falling back to mock products');
      return fetchMockProducts(config, options);
    }

    throw error;
  }
}

/**
 * Fetches a single product by ID
 *
 * @param config - The Shopcore configuration
 * @param productId - The product ID
 * @returns A promise that resolves to the product
 */
export async function fetchProductById(config: ShopcoreConfig, productId: string): Promise<Product> {
  try {
    logger.info('Fetching product by ID', { productId });

    // Use the mock system if enabled
    if (config.mock?.enabled) {
      return fetchMockProductById(config, productId);
    }

    // Check if API configuration exists
    const apiConfig = (config as any).api as ApiConfig | undefined;
    if (!apiConfig) {
      throw new Error('API configuration is missing');
    }

    // Use the API endpoint from config
    const endpoint = `${apiConfig.baseUrl}${apiConfig.endpoints.products}/${productId}`;

    // Fetch the product
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(apiConfig.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product = await response.json();

    return product;
  } catch (error) {
    logger.error('Error fetching product by ID', { error, productId });

    // Fallback to mock data if configured
    const extendedMock = config.mock as ExtendedMockConfig | undefined;
    if (extendedMock?.fallbackOnError) {
      logger.info('Falling back to mock product');
      return fetchMockProductById(config, productId);
    }

    throw error;
  }
}

/**
 * Fetches mock products based on the provided options
 *
 * @param config - The Shopcore configuration
 * @param options - The fetch options
 * @returns A promise that resolves to the fetch result
 */
async function fetchMockProducts(
  config: ShopcoreConfig,
  options: ProductFetchOptions = {}
): Promise<ProductFetchResult> {
  // Get mock products from config
  const extendedMock = config.mock as ExtendedMockConfig | undefined;
  let products = extendedMock?.data?.products || [];

  // Apply filters
  if (options.filters) {
    products = filterProducts(products, options.filters);
  }

  // Apply search
  if (options.search) {
    products = searchProducts(products, options.search);
  }

  // Apply sorting
  if (options.sort) {
    products = sortProducts(products, options.sort);
  }

  // Get total count before pagination
  const total = products.length;

  // Apply pagination
  const pagination = options.pagination || { page: 1, limit: 10 };
  const page = pagination.page;
  const limit = pagination.limit;
  const start = (page - 1) * limit;
  const end = start + limit;

  products = products.slice(start, end);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetches a mock product by ID
 *
 * @param config - The Shopcore configuration
 * @param productId - The product ID
 * @returns A promise that resolves to the product
 */
async function fetchMockProductById(config: ShopcoreConfig, productId: string): Promise<Product> {
  // Get mock products from config
  const extendedMock = config.mock as ExtendedMockConfig | undefined;
  const products = extendedMock?.data?.products || [];

  // Find the product by ID
  const product = products.find((p) => p.id === productId);

  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  return product;
}

/**
 * Filters products based on the provided options
 *
 * @param products - The products to filter
 * @param options - The filter options
 * @returns The filtered products
 */
export function filterProducts(products: Product[], options: ProductFilterOptions): Product[] {
  return products.filter((product) => {
    // Filter by category
    if (options.category) {
      // If product has categories array, check if it includes the filter category
      if (product.categories && Array.isArray(product.categories)) {
        if (!product.categories.includes(options.category as ProductCategory)) {
          return false;
        }
      }
      // Otherwise check the single category property
      else if (product.category !== options.category) {
        return false;
      }
    }

    // Filter by price
    if (options.minPrice !== undefined && product.price < options.minPrice) {
      return false;
    }

    if (options.maxPrice !== undefined && product.price > options.maxPrice) {
      return false;
    }

    // Filter by stock
    if (options.inStock !== undefined && product.inStock !== options.inStock) {
      return false;
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0 && product.tags) {
      const hasTag = options.tags.some((tag) => product.tags?.includes(tag));
      if (!hasTag) {
        return false;
      }
    }

    // Filter by attributes
    if (options.attributes && product.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        if (product.attributes[key] !== value) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Sorts products based on the provided options
 *
 * @param products - The products to sort
 * @param options - The sort options
 * @returns The sorted products
 */
export function sortProducts(products: Product[], options: ProductSortOptions): Product[] {
  return [...products].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    // Get the values to compare
    switch (options.field) {
      case 'price':
        valueA = a.price;
        valueB = b.price;
        break;
      case 'name':
        valueA = a.name;
        valueB = b.name;
        break;
      case 'createdAt':
        valueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        valueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        break;
      case 'rating':
        valueA = a.rating || 0;
        valueB = b.rating || 0;
        break;
      case 'popularity':
        // Use a custom popularity metric or fallback to rating
        valueA = (a as any).popularity || a.rating || 0;
        valueB = (b as any).popularity || b.rating || 0;
        break;
      default:
        return 0;
    }

    // Compare the values
    if (options.direction === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
}

/**
 * Searches products based on the provided options
 *
 * @param products - The products to search
 * @param options - The search options
 * @returns The matching products
 */
export function searchProducts(products: Product[], options: ProductSearchOptions): Product[] {
  if (!options.query) {
    return products;
  }

  const normalizedQuery = options.query.toLowerCase();
  const fields = options.fields || ['name', 'description'];

  return products.filter((product) => {
    return fields.some((field) => {
      switch (field) {
        case 'name':
          return product.name.toLowerCase().includes(normalizedQuery);
        case 'description':
          return product.description?.toLowerCase().includes(normalizedQuery) || false;
        case 'sku':
          // Handle SKU as a custom attribute or variant property
          return (
            (product.attributes?.sku as string)?.toLowerCase().includes(normalizedQuery) ||
            product.variants?.some((v) => v.sku?.toLowerCase().includes(normalizedQuery)) ||
            false
          );
        case 'tags':
          return product.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)) || false;
        default:
          return false;
      }
    });
  });
}

/**
 * Generates a unique product slug from the product name
 *
 * @param name - The product name
 * @param existingSlugs - Optional array of existing slugs to avoid duplicates
 * @returns The generated slug
 */
export function generateProductSlug(name: string, existingSlugs: string[] = []): string {
  // Convert to lowercase and replace spaces with hyphens
  let slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen

  // Check if the slug already exists
  if (existingSlugs.includes(slug)) {
    // Add a random suffix
    const suffix = Math.floor(Math.random() * 1000);
    slug = `${slug}-${suffix}`;
  }

  return slug;
}

/**
 * Calculates the average rating from product reviews
 *
 * @param product - The product
 * @returns The average rating
 */
export function calculateAverageRating(product: Product): number {
  if (!product.reviews || product.reviews.length === 0) {
    return 0;
  }

  const sum = product.reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / product.reviews.length).toFixed(1));
}

/**
 * Checks if a product is on sale
 *
 * @param product - The product to check
 * @returns Whether the product is on sale
 */
export function isProductOnSale(product: Product): boolean {
  return Boolean(product.compareAtPrice && product.price < product.compareAtPrice);
}

/**
 * Gets related products based on categories, tags, and other attributes
 *
 * @param product - The reference product
 * @param allProducts - All available products
 * @param limit - Maximum number of related products to return
 * @returns The related products
 */
export function getRelatedProducts(product: Product, allProducts: Product[], limit: number = 4): Product[] {
  // Filter out the current product
  const otherProducts = allProducts.filter((p) => p.id !== product.id);

  // Score each product based on relevance
  const scoredProducts = otherProducts.map((p) => {
    let score = 0;

    // Same category
    if (product.categories && p.categories) {
      const commonCategories = product.categories.filter((cat: ProductCategory) => p.categories?.includes(cat));
      if (commonCategories.length > 0) {
        score += 3 * commonCategories.length;
      }
    } else if (product.category === p.category) {
      // If categories arrays aren't available, compare single category
      score += 3;
    }

    // Same tags
    if (product.tags && p.tags) {
      const commonTags = product.tags.filter((tag) => p.tags?.includes(tag));
      if (commonTags.length > 0) {
        score += 2 * commonTags.length;
      }
    }

    // Similar price range (within 20%)
    const priceDiff = Math.abs(p.price - product.price);
    const priceThreshold = product.price * 0.2;
    if (priceDiff <= priceThreshold) {
      score += 1;
    }

    return { product: p, score };
  });

  // Sort by score (descending) and take the top N
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
}

/**
 * Checks if a product is new (created within the last 30 days)
 *
 * @param product - The product
 * @returns True if the product is new
 */
export function isNewProduct(product: Product): boolean {
  if (!product.createdAt) {
    return false;
  }

  const createdDate = new Date(product.createdAt);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  return createdDate >= thirtyDaysAgo;
}

/**
 * Gets the stock status text for a product
 *
 * @param product - The product
 * @returns The stock status text
 */
export function getStockStatusText(product: Product): string {
  if (!product.inStock) {
    return 'Out of Stock';
  }

  // Get the stock quantity (either from quantity or stock property)
  const stockQuantity = product.quantity !== undefined ? product.quantity : product.stock;

  if (stockQuantity === undefined || stockQuantity === null) {
    return 'In Stock';
  }

  if (stockQuantity <= 0) {
    return 'Out of Stock';
  }

  if (stockQuantity < 5) {
    return `Only ${stockQuantity} left in stock`;
  }

  return 'In Stock';
}
