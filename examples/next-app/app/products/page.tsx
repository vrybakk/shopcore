'use client';

import { useState } from 'react';
import { defaultConfig, Product, ProductDetail, ProductGrid, ShopcoreProvider, useProducts } from 'shopcore';

/**
 * ProductsPage component
 *
 * This is an example page that demonstrates the use of Shopcore product components.
 */
export default function ProductsPage() {
  return (
    <ShopcoreProvider config={defaultConfig}>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Shopcore Products Example</h1>
        <ProductsDemo />
      </div>
    </ShopcoreProvider>
  );
}

/**
 * ProductsDemo component
 *
 * This component demonstrates the use of the useProducts hook and product components.
 */
function ProductsDemo() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    products,
    loading,
    error,
    filters,
    updateFilter,
    sort,
    setSort,
    search,
    updateSearchQuery,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    totalPages,
  } = useProducts({
    initialPagination: { page: 1, limit: 6 },
    autoFetch: true,
  });

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle product deselection
  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string | null) => {
    updateFilter('category', category || undefined);
  };

  // Handle price range filter
  const handlePriceFilter = (min?: number, max?: number) => {
    updateFilter('minPrice', min);
    updateFilter('maxPrice', max);
  };

  // Handle search
  const handleSearch = (query: string) => {
    updateSearchQuery(query);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split('-') as [any, 'asc' | 'desc'];
    setSort({ field, direction });
  };

  // Get unique categories
  const categories = Array.from(new Set(defaultConfig.mock?.data?.products.map((p) => p.category)));

  return (
    <div>
      {/* Product Detail View */}
      {selectedProduct ? (
        <div className='mb-8'>
          <button
            onClick={handleBackToProducts}
            className='mb-4 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Back to Products
          </button>
          <ProductDetail
            product={selectedProduct}
            onAddToCart={(product, quantity) => {
              alert(`Added ${quantity} of ${product.name} to cart`);
            }}
          />
        </div>
      ) : (
        <>
          {/* Filters and Search */}
          <div className='mb-8 grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Search */}
            <div className='md:col-span-2'>
              <label htmlFor='search' className='block text-sm font-medium text-gray-700 mb-1'>
                Search Products
              </label>
              <div className='relative'>
                <input
                  type='text'
                  id='search'
                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                  placeholder='Search by name, description...'
                  value={search.query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-gray-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
                Category
              </label>
              <select
                id='category'
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                value={filters.category || ''}
                onChange={(e) => handleCategoryFilter(e.target.value || null)}
              >
                <option value=''>All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor='sort' className='block text-sm font-medium text-gray-700 mb-1'>
                Sort By
              </label>
              <select
                id='sort'
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                value={`${sort.field}-${sort.direction}`}
                onChange={handleSortChange}
              >
                <option value='price-asc'>Price: Low to High</option>
                <option value='price-desc'>Price: High to Low</option>
                <option value='name-asc'>Name: A to Z</option>
                <option value='name-desc'>Name: Z to A</option>
                <option value='rating-desc'>Highest Rated</option>
                <option value='createdAt-desc'>Newest First</option>
                <option value='popularity-desc'>Most Popular</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className='mb-8'>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Price Range</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='min-price' className='sr-only'>
                  Minimum Price
                </label>
                <input
                  type='number'
                  id='min-price'
                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                  placeholder='Min Price'
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handlePriceFilter(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)
                  }
                />
              </div>
              <div>
                <label htmlFor='max-price' className='sr-only'>
                  Maximum Price
                </label>
                <input
                  type='number'
                  id='max-price'
                  className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                  placeholder='Max Price'
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handlePriceFilter(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
            </div>
          )}

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8'>
              <p>Error: {error.message}</p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && (
            <>
              <div className='mb-4'>
                <p className='text-sm text-gray-500'>
                  Showing {products.length} of {pagination.limit * (pagination.page - 1) + products.length} products
                </p>
              </div>

              <ProductGrid products={products} onProductClick={handleProductSelect} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex justify-center mt-8'>
                  <nav className='flex items-center'>
                    <button
                      onClick={prevPage}
                      disabled={pagination.page === 1}
                      className={`px-3 py-1 rounded-l-md border ${
                        pagination.page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 border-t border-b ${
                          pagination.page === i + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={pagination.page === totalPages}
                      className={`px-3 py-1 rounded-r-md border ${
                        pagination.page === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
