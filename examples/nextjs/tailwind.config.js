/** @type {import('tailwindcss').Config} */
import shopcorePlugin from 'shopcore/tailwind';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    // Add the Shopcore plugin
    shopcorePlugin({
      // Use CSS variables for theming
      cssVariables: true,
    }),
  ],
  darkMode: 'class',
};
