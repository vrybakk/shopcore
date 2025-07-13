'use client';

import { Inter } from 'next/font/google';
import { ShopcoreProvider, createShopcoreConfig, mockProducts } from 'shopcore';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { discountPlugin } from '../plugins/discount-plugin';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadata needs to be in a separate file for Next.js 15 with React 19
// export const metadata = {
//   title: 'Shopcore Showcase',
//   description: 'A showcase of the Shopcore e-commerce framework',
// };

// Shopcore configuration
const shopcoreConfig = createShopcoreConfig({
  mode: 'development' as const,
  debug: true,
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP'],
  defaultLocale: 'en-US',
  supportedLocales: ['en-US', 'es-ES', 'fr-FR'],
  features: {
    cart: true,
    wishlist: true,
    checkout: true,
  },
  mock: {
    enabled: true,
    delay: 500,
    data: {
      products: mockProducts,
    },
  },
  cart: {
    storage: {
      type: 'localStorage',
      key: 'shopcore-cart',
    },
    behavior: {
      maxQuantityPerItem: 10,
      minQuantityPerItem: 1,
      mergeSameItems: true,
    },
    pricing: {
      shouldIncludeTax: true,
      taxRate: 0.2,
    },
  },
});

// Plugins to use
const plugins = [discountPlugin];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ShopcoreProvider config={shopcoreConfig} plugins={plugins}>
          <Navbar />
          <main className='min-h-screen'>{children}</main>
          <Footer />
        </ShopcoreProvider>
      </body>
    </html>
  );
}
