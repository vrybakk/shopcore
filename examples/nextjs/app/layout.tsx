import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ShopcoreProvider } from 'shopcore';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shopcore Example',
  description: 'Example application for Shopcore e-commerce framework',
};

// Shopcore configuration
const shopcoreConfig = {
  mode: 'development',
  debug: true,
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP'],
  defaultLocale: 'en-US',
  supportedLocales: ['en-US', 'es-ES', 'fr-FR'],
  theme: {
    colorScheme: 'system',
    primaryColor: '#0070f3',
    radius: 8,
  },
  enableCart: true,
  enableWishlist: true,
  enableCheckout: true,
  mock: {
    enabled: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ShopcoreProvider config={shopcoreConfig}>
          <header className='bg-white shadow-sm'>
            <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
              <a href='/' className='text-2xl font-bold text-blue-600'>
                Shopcore
              </a>
              <nav>
                <ul className='flex space-x-6'>
                  <li>
                    <a href='/' className='text-gray-600 hover:text-blue-600 transition-colors'>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href='/products' className='text-gray-600 hover:text-blue-600 transition-colors'>
                      Products
                    </a>
                  </li>
                  <li>
                    <a href='/theme' className='text-gray-600 hover:text-blue-600 transition-colors'>
                      Theme
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://github.com/yourusername/shopcore'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-600 hover:text-blue-600 transition-colors'
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </ShopcoreProvider>
      </body>
    </html>
  );
}
