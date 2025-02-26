import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4'>
      <div className='max-w-4xl w-full text-center'>
        <h1 className='text-5xl font-bold text-blue-600 mb-6'>Welcome to Shopcore Demo</h1>

        <p className='text-xl text-gray-600 mb-12 max-w-2xl mx-auto'>
          Shopcore is a flexible and powerful e-commerce framework for building modern shopping experiences.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>
          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Product Components</h2>
            <p className='text-gray-600 mb-6'>
              Explore our product components including product cards, grids, and detail views with filtering, sorting,
              and pagination.
            </p>
            <Link
              href='/products'
              className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors'
            >
              View Products Demo
            </Link>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Framework Features</h2>
            <p className='text-gray-600 mb-6'>
              Shopcore includes a robust configuration system, hooks for data fetching, utilities for formatting, and
              more.
            </p>
            <div className='text-left'>
              <ul className='list-disc list-inside text-gray-600 space-y-2 mb-6'>
                <li>Type-safe configuration</li>
                <li>Product management utilities</li>
                <li>Price formatting</li>
                <li>Mock data system</li>
                <li>Responsive UI components</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='bg-blue-50 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold text-blue-800 mb-2'>Getting Started</h2>
          <p className='text-gray-600 mb-4'>
            Shopcore is designed to be easy to integrate into your Next.js, React, or other modern web applications.
          </p>
          <div className='bg-gray-800 text-gray-200 p-4 rounded text-left overflow-x-auto'>
            <code>npm install shopcore</code>
          </div>
        </div>
      </div>

      <footer className='mt-16 text-center text-gray-500'>
        <p>© 2023 Shopcore. All rights reserved.</p>
      </footer>
    </div>
  );
}
