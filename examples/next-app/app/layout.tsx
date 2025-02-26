import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shopcore Demo',
  description: 'A demonstration of the Shopcore e-commerce framework',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">Shopcore</a>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="https://github.com/yourusername/shopcore" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
} 