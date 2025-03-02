'use client';

import { Inter } from 'next/font/google';
import { ShopcoreProvider, mockProducts } from 'shopcore';
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
const shopcoreConfig = {
  mode: 'development' as const,
  debug: true,
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP'],
  defaultLocale: 'en-US',
  supportedLocales: ['en-US', 'es-ES', 'fr-FR'],
  enableCart: true,
  enableWishlist: true,
  enableCheckout: true,
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      info: '#3b82f6',
      border: '#e5e7eb',
      muted: '#9ca3af',
      severity: '#ef4444',
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
      heading: 'Poppins, sans-serif',
      monospace: 'Menlo, Monaco, Consolas, monospace',
    },
    borderRadius: {
      small: '0.25rem',
      medium: '0.5rem',
      large: '1rem',
      full: '9999px',
    },
  },
  mock: {
    enabled: true,
    delay: 500,
    data: {
      products: mockProducts,
    },
  },
};

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
