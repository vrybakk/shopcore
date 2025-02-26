import { useCallback, useEffect, useState } from 'react';
import { Product } from '../core/types/product';
import { logger } from '../utils/logger';
import {
  fetchProductById,
  fetchProducts,
  ProductFetchOptions,
  ProductFetchResult,
  ProductFilterOptions,
  ProductPaginationOptions,
  ProductSearchOptions,
  ProductSortOptions,
} from '../utils/products';
import { useShopcoreConfig } from './useShopcoreConfig';

/**
 * Interface for the useProducts hook result
 */
export interface UseProductsResult {
  // Data
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  // Loading and error states
  loading: boolean;
  error: Error | null;

  // Actions
  fetchProducts: (options?: ProductFetchOptions) => Promise<void>;
  fetchProductById: (productId: string) => Promise<Product | null>;

  // Filters and sorting
  filters: ProductFilterOptions;
  setFilters: (filters: ProductFilterOptions) => void;
  updateFilter: <K extends keyof ProductFilterOptions>(key: K, value: ProductFilterOptions[K]) => void;

  sort: ProductSortOptions;
  setSort: (sort: ProductSortOptions) => void;

  // Search
  search: ProductSearchOptions;
  setSearch: (search: ProductSearchOptions) => void;
  updateSearchQuery: (query: string) => void;

  // Pagination
  pagination: ProductPaginationOptions;
  setPagination: (pagination: ProductPaginationOptions) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Reset
  resetFilters: () => void;
  resetAll: () => void;
}

/**
 * Interface for the useProducts hook options
 */
export interface UseProductsOptions {
  initialFilters?: ProductFilterOptions;
  initialSort?: ProductSortOptions;
  initialSearch?: ProductSearchOptions;
  initialPagination?: ProductPaginationOptions;
  autoFetch?: boolean;
}

/**
 * Default options for the useProducts hook
 */
const defaultOptions: UseProductsOptions = {
  initialFilters: {},
  initialSort: { field: 'createdAt', direction: 'desc' },
  initialSearch: { query: '' },
  initialPagination: { page: 1, limit: 10 },
  autoFetch: true,
};

/**
 * Hook for using products with the Shopcore configuration
 *
 * @param options - The hook options
 * @returns The hook result
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { config } = useShopcoreConfig();

  // Merge options with defaults
  const mergedOptions = { ...defaultOptions, ...options };

  // State for products data
  const [productData, setProductData] = useState<ProductFetchResult>({
    products: [],
    total: 0,
    page: mergedOptions.initialPagination?.page || 1,
    limit: mergedOptions.initialPagination?.limit || 10,
    totalPages: 0,
  });

  // State for loading and error
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // State for filters, sorting, search, and pagination
  const [filters, setFilters] = useState<ProductFilterOptions>(mergedOptions.initialFilters || {});

  const [sort, setSort] = useState<ProductSortOptions>(
    mergedOptions.initialSort || { field: 'createdAt', direction: 'desc' }
  );

  const [search, setSearch] = useState<ProductSearchOptions>(mergedOptions.initialSearch || { query: '' });

  const [pagination, setPagination] = useState<ProductPaginationOptions>(
    mergedOptions.initialPagination || { page: 1, limit: 10 }
  );

  /**
   * Fetches products with the current options
   */
  const fetchProductsWithOptions = useCallback(
    async (customOptions?: ProductFetchOptions): Promise<void> => {
      if (!config) {
        logger.error('Shopcore config is not available');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const options: ProductFetchOptions = customOptions || {
          filters,
          sort,
          search,
          pagination,
        };

        const result = await fetchProducts(config, options);

        setProductData(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch products');
        setError(error);
        logger.error('Error fetching products', { error });
      } finally {
        setLoading(false);
      }
    },
    [config, filters, sort, search, pagination]
  );

  /**
   * Fetches a single product by ID
   */
  const fetchSingleProductById = useCallback(
    async (productId: string): Promise<Product | null> => {
      if (!config) {
        logger.error('Shopcore config is not available');
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const product = await fetchProductById(config, productId);

        return product;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(`Failed to fetch product: ${productId}`);
        setError(error);
        logger.error('Error fetching product by ID', { error, productId });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [config]
  );

  /**
   * Updates a single filter value
   */
  const updateFilter = useCallback(
    <K extends keyof ProductFilterOptions>(key: K, value: ProductFilterOptions[K]): void => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Reset to first page when filters change
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    []
  );

  /**
   * Updates the search query
   */
  const updateSearchQuery = useCallback((query: string): void => {
    setSearch((prev) => ({
      ...prev,
      query,
    }));

    // Reset to first page when search changes
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  }, []);

  /**
   * Goes to a specific page
   */
  const goToPage = useCallback(
    (page: number): void => {
      if (page < 1 || page > productData.totalPages) {
        return;
      }

      setPagination((prev) => ({
        ...prev,
        page,
      }));
    },
    [productData.totalPages]
  );

  /**
   * Goes to the next page
   */
  const nextPage = useCallback((): void => {
    if (pagination.page < productData.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, productData.totalPages]);

  /**
   * Goes to the previous page
   */
  const prevPage = useCallback((): void => {
    if (pagination.page > 1) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  }, [pagination.page]);

  /**
   * Resets all filters
   */
  const resetFilters = useCallback((): void => {
    setFilters(mergedOptions.initialFilters || {});
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [mergedOptions.initialFilters]);

  /**
   * Resets all options (filters, sort, search, pagination)
   */
  const resetAll = useCallback((): void => {
    setFilters(mergedOptions.initialFilters || {});
    setSort(mergedOptions.initialSort || { field: 'createdAt', direction: 'desc' });
    setSearch(mergedOptions.initialSearch || { query: '' });
    setPagination(mergedOptions.initialPagination || { page: 1, limit: 10 });
  }, [
    mergedOptions.initialFilters,
    mergedOptions.initialSort,
    mergedOptions.initialSearch,
    mergedOptions.initialPagination,
  ]);

  // Fetch products when options change
  useEffect(() => {
    if (config && mergedOptions.autoFetch) {
      fetchProductsWithOptions();
    }
  }, [config, filters, sort, search, pagination, fetchProductsWithOptions, mergedOptions.autoFetch]);

  return {
    // Data
    products: productData.products,
    total: productData.total,
    page: productData.page,
    limit: productData.limit,
    totalPages: productData.totalPages,

    // Loading and error states
    loading,
    error,

    // Actions
    fetchProducts: fetchProductsWithOptions,
    fetchProductById: fetchSingleProductById,

    // Filters and sorting
    filters,
    setFilters,
    updateFilter,

    sort,
    setSort,

    // Search
    search,
    setSearch,
    updateSearchQuery,

    // Pagination
    pagination,
    setPagination,
    goToPage,
    nextPage,
    prevPage,

    // Reset
    resetFilters,
    resetAll,
  };
}

/**
 * Hook for fetching a single product by ID
 *
 * @param productId - The product ID
 * @returns The hook result
 */
export function useProduct(productId: string) {
  const { config } = useShopcoreConfig();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async (): Promise<void> => {
    if (!config) {
      logger.error('Shopcore config is not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchProductById(config, productId);

      setProduct(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch product: ${productId}`);
      setError(error);
      logger.error('Error fetching product', { error, productId });
    } finally {
      setLoading(false);
    }
  }, [config, productId]);

  useEffect(() => {
    if (config && productId) {
      fetchProduct();
    }
  }, [config, productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
