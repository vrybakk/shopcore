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
    <html lang="en">
      <body className={inter.className}>
        <ShopcoreProvider config={shopcoreConfig}>
          {children}
        </ShopcoreProvider>
      </body>
    </html>
  );
} 