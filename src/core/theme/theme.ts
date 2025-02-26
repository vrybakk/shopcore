/**
 * Shopcore Theming System
 *
 * This file contains the theming system for Shopcore, including CSS variables
 * and theme configuration.
 */

/**
 * Theme colors interface
 */
export interface ThemeColors {
  /**
   * Primary color used for buttons, links, and other primary UI elements
   */
  primary: string;

  /**
   * Secondary color used for secondary UI elements
   */
  secondary: string;

  /**
   * Accent color used for highlighting and drawing attention
   */
  accent: string;

  /**
   * Background color for the main content
   */
  background: string;

  /**
   * Text color for the main content
   */
  text: string;

  /**
   * Error color used for error messages and states
   */
  error: string;

  /**
   * Success color used for success messages and states
   */
  success: string;

  /**
   * Warning color used for warning messages and states
   */
  warning: string;

  /**
   * Info color used for informational messages and states
   */
  info: string;

  /**
   * Border color for UI elements
   */
  border: string;

  /**
   * Muted color for less important UI elements
   */
  muted: string;
}

/**
 * Theme fonts interface
 */
export interface ThemeFonts {
  /**
   * Font family for body text
   */
  body: string;

  /**
   * Font family for headings
   */
  heading: string;

  /**
   * Font family for monospace text
   */
  monospace: string;
}

/**
 * Theme border radius interface
 */
export interface ThemeBorderRadius {
  /**
   * Small border radius
   */
  small: string;

  /**
   * Medium border radius
   */
  medium: string;

  /**
   * Large border radius
   */
  large: string;

  /**
   * Full border radius (circle)
   */
  full: string;
}

/**
 * Theme spacing interface
 */
export interface ThemeSpacing {
  /**
   * Extra small spacing
   */
  xs: string;

  /**
   * Small spacing
   */
  sm: string;

  /**
   * Medium spacing
   */
  md: string;

  /**
   * Large spacing
   */
  lg: string;

  /**
   * Extra large spacing
   */
  xl: string;

  /**
   * Extra extra large spacing
   */
  xxl: string;
}

/**
 * Theme breakpoints interface
 */
export interface ThemeBreakpoints {
  /**
   * Small breakpoint
   */
  sm: string;

  /**
   * Medium breakpoint
   */
  md: string;

  /**
   * Large breakpoint
   */
  lg: string;

  /**
   * Extra large breakpoint
   */
  xl: string;

  /**
   * Extra extra large breakpoint
   */
  xxl: string;
}

/**
 * Theme interface
 */
export interface Theme {
  /**
   * Theme colors
   */
  colors: ThemeColors;

  /**
   * Theme fonts
   */
  fonts: ThemeFonts;

  /**
   * Theme border radius
   */
  borderRadius: ThemeBorderRadius;

  /**
   * Theme spacing
   */
  spacing: ThemeSpacing;

  /**
   * Theme breakpoints
   */
  breakpoints: ThemeBreakpoints;
}

/**
 * Default theme
 */
export const defaultTheme: Theme = {
  colors: {
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
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    monospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
};

/**
 * Generate CSS variables from a theme
 *
 * @param theme The theme to generate CSS variables from
 * @returns CSS variables as a string
 */
export function generateCssVariables(theme: Theme): string {
  const variables: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables.push(`--shopcore-color-${key}: ${value};`);
  });

  // Fonts
  Object.entries(theme.fonts).forEach(([key, value]) => {
    variables.push(`--shopcore-font-${key}: ${value};`);
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables.push(`--shopcore-radius-${key}: ${value};`);
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables.push(`--shopcore-spacing-${key}: ${value};`);
  });

  return variables.join('\n  ');
}

/**
 * Generate a CSS stylesheet with theme variables
 *
 * @param theme The theme to generate CSS variables from
 * @returns A CSS stylesheet as a string
 */
export function generateThemeStylesheet(theme: Theme): string {
  return `/**
 * Shopcore Theme Variables
 * Generated from theme configuration
 */

:root {
  ${generateCssVariables(theme)}
}

/* Dark mode variables */
@media (prefers-color-scheme: dark) {
  :root {
    --shopcore-color-background: #0f172a;
    --shopcore-color-text: #f8fafc;
    --shopcore-color-border: #334155;
    --shopcore-color-muted: #64748b;
  }
}

/* Theme class for forced light mode */
.shopcore-theme-light {
  --shopcore-color-background: ${theme.colors.background};
  --shopcore-color-text: ${theme.colors.text};
  --shopcore-color-border: ${theme.colors.border};
  --shopcore-color-muted: ${theme.colors.muted};
}

/* Theme class for forced dark mode */
.shopcore-theme-dark {
  --shopcore-color-background: #0f172a;
  --shopcore-color-text: #f8fafc;
  --shopcore-color-border: #334155;
  --shopcore-color-muted: #64748b;
}
`;
}

/**
 * Merge a custom theme with the default theme
 *
 * @param customTheme The custom theme to merge with the default theme
 * @returns The merged theme
 */
export function mergeTheme(customTheme: Partial<Theme>): Theme {
  return {
    colors: {
      ...defaultTheme.colors,
      ...customTheme.colors,
    },
    fonts: {
      ...defaultTheme.fonts,
      ...customTheme.fonts,
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      ...customTheme.borderRadius,
    },
    spacing: {
      ...defaultTheme.spacing,
      ...customTheme.spacing,
    },
    breakpoints: {
      ...defaultTheme.breakpoints,
      ...customTheme.breakpoints,
    },
  };
}
