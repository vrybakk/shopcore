'use client';

import { useState } from 'react';
import { ShopcoreConfig } from 'shopcore';

interface ConfigDisplayProps {
  config: ShopcoreConfig;
}

export default function ConfigDisplay({ config }: ConfigDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    core: true,
    features: false,
    currency: false,
    localization: false,
    theme: false,
    performance: false,
    mock: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper to render simple key-value pairs
  const renderValue = (value: any): React.ReactNode => {
    if (value === undefined) return <span className="text-gray-400">undefined</span>;
    if (value === null) return <span className="text-gray-400">null</span>;
    
    if (typeof value === 'boolean') {
      return (
        <span className={value ? 'text-green-500' : 'text-red-500'}>
          {value.toString()}
        </span>
      );
    }
    
    if (typeof value === 'string') return <span className="text-blue-500">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-purple-500">{value}</span>;
    if (typeof value === 'function') return <span className="text-gray-400">[Function]</span>;
    
    if (Array.isArray(value)) {
      return (
        <span className="text-gray-600">
          [
          {value.map((item, i) => (
            <span key={i}>
              {renderValue(item)}
              {i < value.length - 1 && ', '}
            </span>
          ))}
          ]
        </span>
      );
    }
    
    if (typeof value === 'object') {
      return <span className="text-gray-400">{JSON.stringify(value)}</span>;
    }
    
    return String(value);
  };

  // Section renderer
  const renderSection = (title: string, sectionKey: string, items: Array<[string, any]>) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="mb-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium p-2 bg-gray-100 dark:bg-gray-700 rounded"
          onClick={() => toggleSection(sectionKey)}
        >
          <span>{title}</span>
          <span>{isExpanded ? '▼' : '►'}</span>
        </button>
        
        {isExpanded && (
          <div className="pl-4 pt-2 border-l-2 border-gray-200 dark:border-gray-600 ml-2">
            {items.map(([key, value]) => (
              <div key={key} className="py-1">
                <span className="font-mono text-gray-600 dark:text-gray-300">{key}: </span>
                {renderValue(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="font-mono text-sm">
      {renderSection('Core Settings', 'core', [
        ['mode', config.mode],
        ['debug', config.debug],
      ])}
      
      {renderSection('Feature Flags', 'features', [
        ['enableCart', config.enableCart],
        ['enableWishlist', config.enableWishlist],
        ['enableCheckout', config.enableCheckout],
        ['enableReviews', config.enableReviews],
        ['enableUpselling', config.enableUpselling],
      ])}
      
      {renderSection('Currency Settings', 'currency', [
        ['defaultCurrency', config.defaultCurrency],
        ['supportedCurrencies', config.supportedCurrencies],
        ['currencyFormat', config.currencyFormat],
        ['fallbackCurrency', config.fallbackCurrency],
      ])}
      
      {renderSection('Localization Settings', 'localization', [
        ['defaultLocale', config.defaultLocale],
        ['supportedLocales', config.supportedLocales],
        ['enableTranslations', config.enableTranslations],
      ])}
      
      {renderSection('Theme Settings', 'theme', [
        ['colorScheme', config.theme?.colorScheme],
        ['primaryColor', config.theme?.primaryColor],
        ['radius', config.theme?.radius],
      ])}
      
      {renderSection('Performance Settings', 'performance', [
        ['enableLazyLoading', config.enableLazyLoading],
        ['enableSSR', config.enableSSR],
        ['cacheStrategy', config.cacheStrategy],
        ['cacheSettings', config.cacheSettings],
      ])}
      
      {renderSection('Mock System', 'mock', [
        ['enabled', config.mock?.enabled],
      ])}
    </div>
  );
} 