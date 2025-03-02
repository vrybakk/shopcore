'use client';

import { ProductGrid, useProducts, useShopcoreConfig } from 'shopcore';

export default function Home() {
  const { products, loading } = useProducts();
  const { defaultCurrency, defaultLocale } = useShopcoreConfig();

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(defaultLocale || 'en-US', {
      style: 'currency',
      currency: defaultCurrency || 'USD',
    }).format(price);
  };

  return (
    <main className='flex min-h-screen flex-col items-center p-8'>
      <header className='w-full max-w-7xl mb-12'>
        <h1 className='text-4xl font-bold text-center mb-4'>Shopcore Showcase</h1>
        <p className='text-lg text-center text-gray-600'>A demonstration of the Shopcore e-commerce framework</p>
      </header>

      <section className='w-full max-w-7xl'>
        <h2 className='text-2xl font-semibold mb-6'>Featured Products</h2>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
          </div>
        ) : (
          <ProductGrid
            products={products.filter((p) => p.featured)}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          />
        )}
      </section>

      <section className='w-full max-w-7xl mt-16'>
        <h2 className='text-2xl font-semibold mb-6'>All Products</h2>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((product) => (
              <div
                key={product.id}
                className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'
              >
                {product.image && (
                  <div className='aspect-square overflow-hidden'>
                    <img src={product.image} alt={product.name} className='w-full h-full object-cover' />
                  </div>
                )}
                <div className='p-4'>
                  <h3 className='font-medium text-lg'>{product.name}</h3>
                  <div className='flex justify-between items-center mt-2'>
                    <div>
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <div className='flex items-center gap-2'>
                          <span className='text-lg font-bold'>{formatPrice(product.price)}</span>
                          <span className='text-sm text-gray-500 line-through'>
                            {formatPrice(product.originalPrice)}
                          </span>
                        </div>
                      ) : (
                        <span className='text-lg font-bold'>{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors'>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
