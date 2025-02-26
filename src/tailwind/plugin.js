/**
 * Shopcore Tailwind CSS Plugin
 *
 * This plugin adds Shopcore's theme colors and utilities to Tailwind CSS.
 */

/**
 * @typedef {Object} ShopCoreTailwindOptions
 * @property {Object} [colors] - Custom colors to override the default Shopcore colors
 * @property {Object} [borderRadius] - Custom border radius values
 * @property {Object} [spacing] - Custom spacing values
 * @property {boolean} [cssVariables=true] - Whether to use CSS variables for colors
 * @property {boolean} [prefixClasses=true] - Whether to prefix utility classes with 'shopcore-'
 */

/**
 * @param {ShopCoreTailwindOptions} options - Plugin options
 * @returns {import('tailwindcss/plugin').PluginCreator}
 */
module.exports = function (options = {}) {
  const { colors = {}, borderRadius = {}, spacing = {}, cssVariables = true, prefixClasses = true } = options;

  // Default Shopcore colors
  const defaultColors = {
    primary: '#0070f3',
    secondary: '#1e293b',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#0f172a',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    border: '#e2e8f0',
    muted: '#94a3b8',
  };

  // Default border radius values
  const defaultBorderRadius = {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    full: '9999px',
  };

  // Default spacing values
  const defaultSpacing = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  };

  // Merge default and custom values
  const mergedColors = { ...defaultColors, ...colors };
  const mergedBorderRadius = { ...defaultBorderRadius, ...borderRadius };
  const mergedSpacing = { ...defaultSpacing, ...spacing };

  // Generate color object for Tailwind
  const tailwindColors = {};
  Object.entries(mergedColors).forEach(([key, value]) => {
    if (cssVariables) {
      tailwindColors[key] = `var(--shopcore-color-${key}, ${value})`;
    } else {
      tailwindColors[key] = value;
    }
  });

  // Generate border radius object for Tailwind
  const tailwindBorderRadius = {};
  Object.entries(mergedBorderRadius).forEach(([key, value]) => {
    if (cssVariables) {
      tailwindBorderRadius[key] = `var(--shopcore-radius-${key}, ${value})`;
    } else {
      tailwindBorderRadius[key] = value;
    }
  });

  // Generate spacing object for Tailwind
  const tailwindSpacing = {};
  Object.entries(mergedSpacing).forEach(([key, value]) => {
    if (cssVariables) {
      tailwindSpacing[key] = `var(--shopcore-spacing-${key}, ${value})`;
    } else {
      tailwindSpacing[key] = value;
    }
  });

  // Return the plugin
  return function ({ addBase, addComponents, addUtilities, theme, config }) {
    // Add base styles
    addBase({
      ':root': Object.entries(mergedColors).reduce((acc, [key, value]) => {
        acc[`--shopcore-color-${key}`] = value;
        return acc;
      }, {}),
    });

    // Add border radius variables
    addBase({
      ':root': Object.entries(mergedBorderRadius).reduce((acc, [key, value]) => {
        acc[`--shopcore-radius-${key}`] = value;
        return acc;
      }, {}),
    });

    // Add spacing variables
    addBase({
      ':root': Object.entries(mergedSpacing).reduce((acc, [key, value]) => {
        acc[`--shopcore-spacing-${key}`] = value;
        return acc;
      }, {}),
    });

    // Add dark mode variables
    addBase({
      '@media (prefers-color-scheme: dark)': {
        ':root': {
          '--shopcore-color-background': '#0f172a',
          '--shopcore-color-text': '#f8fafc',
          '--shopcore-color-border': '#334155',
          '--shopcore-color-muted': '#64748b',
        },
      },
    });

    // Add utility classes
    const prefix = prefixClasses ? 'shopcore-' : '';

    // Button utilities
    addComponents({
      [`.${prefix}btn`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${tailwindSpacing.sm} ${tailwindSpacing.md}`,
        borderRadius: tailwindBorderRadius.medium,
        fontWeight: '500',
        transition: 'background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        border: '1px solid transparent',
      },
      [`.${prefix}btn-primary`]: {
        backgroundColor: tailwindColors.primary,
        color: 'white',
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${tailwindColors.primary}, black 10%)`,
        },
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${tailwindColors.background}, 0 0 0 4px ${tailwindColors.primary}`,
        },
        '&:disabled': {
          opacity: '0.6',
          cursor: 'not-allowed',
        },
      },
      [`.${prefix}btn-secondary`]: {
        backgroundColor: tailwindColors.secondary,
        color: 'white',
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${tailwindColors.secondary}, black 10%)`,
        },
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${tailwindColors.background}, 0 0 0 4px ${tailwindColors.secondary}`,
        },
        '&:disabled': {
          opacity: '0.6',
          cursor: 'not-allowed',
        },
      },
      [`.${prefix}btn-outline`]: {
        backgroundColor: 'transparent',
        borderColor: tailwindColors.border,
        color: tailwindColors.text,
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${tailwindColors.background}, black 5%)`,
        },
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${tailwindColors.background}, 0 0 0 4px ${tailwindColors.primary}`,
        },
        '&:disabled': {
          opacity: '0.6',
          cursor: 'not-allowed',
        },
      },
    });

    // Form utilities
    addComponents({
      [`.${prefix}input`]: {
        display: 'block',
        width: '100%',
        padding: `${tailwindSpacing.sm} ${tailwindSpacing.md}`,
        border: `1px solid ${tailwindColors.border}`,
        borderRadius: tailwindBorderRadius.medium,
        backgroundColor: tailwindColors.background,
        color: tailwindColors.text,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:focus': {
          outline: 'none',
          borderColor: tailwindColors.primary,
          boxShadow: `0 0 0 2px color-mix(in srgb, ${tailwindColors.primary}, transparent 80%)`,
        },
        '&:disabled': {
          opacity: '0.6',
          cursor: 'not-allowed',
        },
      },
      [`.${prefix}select`]: {
        display: 'block',
        width: '100%',
        padding: `${tailwindSpacing.sm} ${tailwindSpacing.md}`,
        border: `1px solid ${tailwindColors.border}`,
        borderRadius: tailwindBorderRadius.medium,
        backgroundColor: tailwindColors.background,
        color: tailwindColors.text,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `right ${tailwindSpacing.md} center`,
        paddingRight: tailwindSpacing.xl,
        '&:focus': {
          outline: 'none',
          borderColor: tailwindColors.primary,
          boxShadow: `0 0 0 2px color-mix(in srgb, ${tailwindColors.primary}, transparent 80%)`,
        },
      },
    });

    // Card utility
    addComponents({
      [`.${prefix}card`]: {
        backgroundColor: tailwindColors.background,
        borderRadius: tailwindBorderRadius.medium,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        padding: tailwindSpacing.lg,
      },
    });

    // Add the colors to the Tailwind theme
    return {
      theme: {
        extend: {
          colors: {
            shopcore: tailwindColors,
          },
          borderRadius: {
            shopcore: tailwindBorderRadius,
          },
          spacing: {
            shopcore: tailwindSpacing,
          },
        },
      },
    };
  };
};

/**
 * Example usage in tailwind.config.js:
 *
 * ```js
 * const shopcorePlugin = require('shopcore/tailwind');
 *
 * module.exports = {
 *   // ... other Tailwind config
 *   plugins: [
 *     shopcorePlugin({
 *       colors: {
 *         primary: '#ff0000', // Override primary color
 *       },
 *       cssVariables: true,
 *       prefixClasses: true,
 *     }),
 *   ],
 * };
 * ```
 */
