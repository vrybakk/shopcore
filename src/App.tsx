import ProductList from './components/ProductList';
import { ShopcoreConfig, ShopcoreProvider } from './core/context/ShopcoreContext';
import { mockProducts } from './core/mock/products';
import { defaultTheme } from './core/theme/theme';
import { analyticsPlugin } from './plugins/analytics-plugin';

/**
 * Shopcore configuration
 */
const shopcoreConfig: Partial<ShopcoreConfig> = {
  mode: 'development' as const,
  debug: true,
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP'],
  defaultLocale: 'en-US',
  supportedLocales: ['en-US', 'fr-FR', 'es-ES'],
  features: {
    cart: true,
    wishlist: true,
    checkout: true,
  },
  mock: {
    enabled: true,
  },
};

/**
 * Main application component
 */
function App() {
  return (
    <ShopcoreProvider config={shopcoreConfig} theme={defaultTheme} plugins={[analyticsPlugin]} autoImportStyles={true}>
      <div className='min-h-screen bg-gray-50'>
        <header className='bg-white shadow-sm'>
          <div className='max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8'>
            <h1 className='text-2xl font-bold text-gray-900'>Shopcore Demo</h1>
          </div>
        </header>
        <main>
          <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
            <ProductList products={mockProducts} />
          </div>
        </main>
      </div>
    </ShopcoreProvider>
  );
}

export default App;
