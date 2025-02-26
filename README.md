# Shopcore

Shopcore is a flexible and powerful e-commerce framework for building modern shopping experiences with React and Next.js.

## Features

- **Type-Safe Configuration**: Comprehensive TypeScript interfaces for all configuration options
- **Product Management**: Complete product data model with support for variants, images, and attributes
- **UI Components**: Ready-to-use React components for product cards, grids, and detail views
- **Data Fetching**: Hooks for fetching, filtering, sorting, and searching products
- **Mock System**: Built-in mock data system for development and testing
- **Styling**: CSS utilities and pre-styled components that can be customized
- **Price Formatting**: Utilities for formatting prices and calculating discounts

## Installation

```bash
npm install shopcore
# or
yarn add shopcore
# or
pnpm add shopcore
```

## Quick Start

```tsx
import { ShopcoreProvider, ProductGrid, defaultConfig } from 'shopcore';
import 'shopcore/dist/styles/product.css';

function App() {
  return (
    <ShopcoreProvider config={defaultConfig}>
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Our Products</h1>
        <ProductGrid />
      </div>
    </ShopcoreProvider>
  );
}
```

## Configuration

Shopcore is highly configurable. You can customize the behavior of the framework by providing your own configuration:

```tsx
import { ShopcoreProvider, ShopcoreConfig } from 'shopcore';

const config: ShopcoreConfig = {
  version: '0.1.0',
  debug: true,
  api: {
    baseUrl: 'https://your-api.com',
    endpoints: {
      products: '/api/products',
      // ...other endpoints
    },
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  },
  // ...other configuration options
};

function App({ children }) {
  return <ShopcoreProvider config={config}>{children}</ShopcoreProvider>;
}
```

## Components

### ProductCard

```tsx
import { ProductCard } from 'shopcore';

function ProductList({ products }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={(product) => {
            // Handle add to cart
          }}
        />
      ))}
    </div>
  );
}
```

### ProductGrid

```tsx
import { ProductGrid } from 'shopcore';

function ProductsPage() {
  return (
    <ProductGrid
      onProductClick={(product) => {
        // Handle product click
      }}
    />
  );
}
```

### ProductDetail

```tsx
import { ProductDetail } from 'shopcore';

function ProductPage({ product }) {
  return (
    <ProductDetail
      product={product}
      onAddToCart={(product, quantity) => {
        // Handle add to cart
      }}
    />
  );
}
```

## Hooks

### useProducts

```tsx
import { useProducts } from 'shopcore';

function ProductsPage() {
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
  } = useProducts({
    initialFilters: { category: 'electronics' },
    initialSort: { field: 'price', direction: 'asc' },
    initialPagination: { page: 1, limit: 10 },
  });

  // Use these values and functions to build your UI
}
```

### useProduct

```tsx
import { useProduct } from 'shopcore';

function ProductPage({ productId }) {
  const { product, loading, error, refetch } = useProduct(productId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      {/* Rest of your product UI */}
    </div>
  );
}
```

### usePrice

```tsx
import { usePrice } from 'shopcore';

function PriceDisplay({ price, originalPrice }) {
  const { formattedPrice, formattedOriginalPrice, discountPercentage } = usePrice({
    price,
    originalPrice,
  });

  return (
    <div>
      <span className='text-xl font-bold'>{formattedPrice}</span>
      {discountPercentage > 0 && (
        <>
          <span className='text-gray-500 line-through ml-2'>{formattedOriginalPrice}</span>
          <span className='text-red-500 ml-2'>-{discountPercentage}%</span>
        </>
      )}
    </div>
  );
}
```

## Utilities

### Price Formatting

```tsx
import { formatPrice, calculateDiscountPercentage } from 'shopcore';

const price = formatPrice(19.99, {
  currency: 'USD',
  locale: 'en-US',
});
// $19.99

const discount = calculateDiscountPercentage(19.99, 29.99);
// 33
```

### Product Utilities

```tsx
import { isProductOnSale, getStockStatusText, isNewProduct, getRelatedProducts } from 'shopcore';

// Check if a product is on sale
const onSale = isProductOnSale(product);

// Get stock status text
const stockStatus = getStockStatusText(product);
// "In Stock", "Out of Stock", "Only 3 left in stock", etc.

// Check if a product is new (less than 30 days old)
const isNew = isNewProduct(product);

// Get related products
const relatedProducts = getRelatedProducts(product, allProducts, 4);
```

## Mock System

Shopcore includes a mock system for development and testing:

```tsx
import { ShopcoreProvider, defaultConfig } from 'shopcore';

// Enable the mock system
const config = {
  ...defaultConfig,
  mock: {
    enabled: true,
    fallbackOnError: true,
    // You can provide your own mock data
    data: {
      products: yourMockProducts,
    },
  },
};

function App({ children }) {
  return <ShopcoreProvider config={config}>{children}</ShopcoreProvider>;
}
```

## CSS Styles

Shopcore provides CSS styles for its components:

```tsx
// Import the CSS in your application
import 'shopcore/dist/styles/product.css';
```

You can override these styles by defining your own CSS with higher specificity or by using the provided class names.

## TypeScript Support

Shopcore is built with TypeScript and provides comprehensive type definitions for all its APIs.

## License

MIT
