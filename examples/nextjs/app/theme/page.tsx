'use client';

import { useState } from 'react';
import { Theme, defaultTheme, mergeTheme } from 'shopcore';

export default function ThemePage() {
  const [currentTheme, setCurrentTheme] = useState<'default' | 'dark' | 'colorful'>('default');

  // Define our theme variations
  const themes = {
    default: defaultTheme,
    dark: mergeTheme({
      colors: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        background: '#1e293b',
        text: '#f8fafc',
        border: '#334155',
        muted: '#64748b',
      },
    }),
    colorful: mergeTheme({
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#0f172a',
        border: '#e2e8f0',
        muted: '#94a3b8',
      },
      borderRadius: {
        small: '0.5rem',
        medium: '1rem',
        large: '1.5rem',
        full: '9999px',
      },
    }),
  };

  // Get the selected theme
  const selectedTheme = themes[currentTheme];

  // Generate CSS variables for the selected theme
  const themeStyles = {
    '--shopcore-color-primary': selectedTheme.colors.primary,
    '--shopcore-color-secondary': selectedTheme.colors.secondary,
    '--shopcore-color-accent': selectedTheme.colors.accent,
    '--shopcore-color-background': selectedTheme.colors.background,
    '--shopcore-color-text': selectedTheme.colors.text,
    '--shopcore-color-border': selectedTheme.colors.border,
    '--shopcore-color-muted': selectedTheme.colors.muted,
    '--shopcore-radius-small': selectedTheme.borderRadius.small,
    '--shopcore-radius-medium': selectedTheme.borderRadius.medium,
    '--shopcore-radius-large': selectedTheme.borderRadius.large,
    '--shopcore-radius-full': selectedTheme.borderRadius.full,
  } as React.CSSProperties;

  return (
    <div className='min-h-screen' style={themeStyles}>
      <div className='container mx-auto px-4 py-12'>
        <h1 className='text-4xl font-bold mb-8 text-center' style={{ color: 'var(--shopcore-color-text)' }}>
          Shopcore Theming System
        </h1>

        <div className='mb-8 flex justify-center space-x-4'>
          <button
            onClick={() => setCurrentTheme('default')}
            className={`px-4 py-2 rounded-md ${currentTheme === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Default Theme
          </button>
          <button
            onClick={() => setCurrentTheme('dark')}
            className={`px-4 py-2 rounded-md ${currentTheme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Dark Theme
          </button>
          <button
            onClick={() => setCurrentTheme('colorful')}
            className={`px-4 py-2 rounded-md ${currentTheme === 'colorful' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Colorful Theme
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <ThemePreview theme={selectedTheme} />
          <ComponentShowcase theme={selectedTheme} />
        </div>
      </div>
    </div>
  );
}

function ThemePreview({ theme }: { theme: Theme }) {
  return (
    <div
      className='bg-white p-6 rounded-lg shadow-lg'
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      <h2 className='text-2xl font-semibold mb-4'>Theme Preview</h2>

      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <div className='w-6 h-6 rounded' style={{ backgroundColor: theme.colors.primary }}></div>
          <span>Primary: {theme.colors.primary}</span>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='w-6 h-6 rounded' style={{ backgroundColor: theme.colors.secondary }}></div>
          <span>Secondary: {theme.colors.secondary}</span>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='w-6 h-6 rounded' style={{ backgroundColor: theme.colors.accent }}></div>
          <span>Accent: {theme.colors.accent}</span>
        </div>

        <div className='flex items-center space-x-2'>
          <div
            className='w-6 h-6 rounded border'
            style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}
          ></div>
          <span>Background: {theme.colors.background}</span>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='w-6 h-6 rounded' style={{ backgroundColor: theme.colors.text }}></div>
          <span>Text: {theme.colors.text}</span>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium mb-2'>Border Radius</h3>
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <div className='w-12 h-12 bg-blue-500' style={{ borderRadius: theme.borderRadius.small }}></div>
              <span className='text-sm'>Small</span>
            </div>
            <div>
              <div className='w-12 h-12 bg-blue-500' style={{ borderRadius: theme.borderRadius.medium }}></div>
              <span className='text-sm'>Medium</span>
            </div>
            <div>
              <div className='w-12 h-12 bg-blue-500' style={{ borderRadius: theme.borderRadius.large }}></div>
              <span className='text-sm'>Large</span>
            </div>
            <div>
              <div className='w-12 h-12 bg-blue-500' style={{ borderRadius: theme.borderRadius.full }}></div>
              <span className='text-sm'>Full</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentShowcase({ theme }: { theme: Theme }) {
  return (
    <div
      className='bg-white p-6 rounded-lg shadow-lg'
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      <h2 className='text-2xl font-semibold mb-4'>Component Showcase</h2>

      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-medium mb-2'>Buttons</h3>
          <div className='flex flex-wrap gap-2'>
            <button className='shopcore-button shopcore-button-primary'>Primary</button>
            <button className='shopcore-button shopcore-button-secondary'>Secondary</button>
            <button className='shopcore-button shopcore-button-outline'>Outline</button>
            <button className='shopcore-button shopcore-button-ghost'>Ghost</button>
          </div>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Form Elements</h3>
          <div className='space-y-3'>
            <div>
              <label className='shopcore-label'>Text Input</label>
              <input type='text' className='shopcore-input' placeholder='Enter text...' />
            </div>
            <div>
              <label className='shopcore-label'>Select</label>
              <select className='shopcore-select'>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className='shopcore-checkbox'>
              <input type='checkbox' id='checkbox1' />
              <label htmlFor='checkbox1'>Checkbox</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Card</h3>
          <div className='shopcore-card'>
            <h4 className='text-xl font-medium mb-2'>Card Title</h4>
            <p className='mb-4'>This is a sample card component that uses the theme variables for styling.</p>
            <button className='shopcore-button shopcore-button-primary'>Action</button>
          </div>
        </div>
      </div>
    </div>
  );
}
