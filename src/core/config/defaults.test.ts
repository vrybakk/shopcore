import { describe, expect, it } from 'vitest';
import { ShopcoreConfig } from '../types/config';
import { defaultConfig, requiredConfigFields, validateConfig } from './defaults';

describe('Configuration validation', () => {
  it('should throw an error when required fields are missing', () => {
    // Empty config should throw an error
    expect(() => validateConfig({})).toThrow();
    
    // Config with only some required fields should throw an error
    expect(() => validateConfig({
      mode: 'development',
      defaultCurrency: 'USD',
      // Missing supportedCurrencies and defaultLocale
    })).toThrow();
  });
  
  it('should validate a complete configuration', () => {
    const config: Partial<ShopcoreConfig> = {
      mode: 'development',
      defaultCurrency: 'USD',
      supportedCurrencies: ['USD'],
      defaultLocale: 'en-US',
    };
    
    const validatedConfig = validateConfig(config);
    
    // Check that all required fields are present
    for (const field of requiredConfigFields) {
      expect(validatedConfig[field]).toBeDefined();
    }
    
    // Check that defaults were applied
    expect(validatedConfig.debug).toBe(defaultConfig.debug);
    expect(validatedConfig.enableCart).toBe(defaultConfig.enableCart);
    expect(validatedConfig.theme?.colorScheme).toBe(defaultConfig.theme?.colorScheme);
  });
  
  it('should merge nested objects correctly', () => {
    const config: Partial<ShopcoreConfig> = {
      mode: 'development',
      defaultCurrency: 'USD',
      supportedCurrencies: ['USD'],
      defaultLocale: 'en-US',
      theme: {
        primaryColor: '#FF0000', // Override primary color
        // colorScheme and radius should be taken from defaults
      },
    };
    
    const validatedConfig = validateConfig(config);
    
    // Check that the theme was merged correctly
    expect(validatedConfig.theme?.primaryColor).toBe('#FF0000');
    expect(validatedConfig.theme?.colorScheme).toBe(defaultConfig.theme?.colorScheme);
    expect(validatedConfig.theme?.radius).toBe(defaultConfig.theme?.radius);
  });
}); 