/**
 * Example Tailwind CSS configuration with Shopcore plugin
 */

const shopcorePlugin = require('../../src/tailwind/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // You can extend the theme here if needed
    },
  },
  plugins: [
    // Add the Shopcore plugin with custom options
    shopcorePlugin({
      // Override default colors
      colors: {
        primary: '#3b82f6', // Change primary color to blue
        accent: '#8b5cf6', // Change accent color to purple
      },
      // Override default border radius
      borderRadius: {
        medium: '0.375rem', // Change medium border radius
      },
      // Use CSS variables for theming
      cssVariables: true,
      // Prefix utility classes with 'shopcore-'
      prefixClasses: true,
    }),
  ],
  // Enable dark mode based on class
  darkMode: 'class',
};
