'use client';

import React from 'react';
import { CartProvider } from '../cart/context';
import { ShopcoreConfig } from '../context/ShopcoreContext';

export interface ProviderConfig {
  Component: React.ComponentType<any>;
  isEnabled: (config: ShopcoreConfig) => boolean;
  getProps: (config: ShopcoreConfig) => any;
}

export const providers: ProviderConfig[] = [
  {
    Component: CartProvider,
    isEnabled: (config) => Boolean(config.cart?.enabled),
    getProps: (config) => ({
      config: {
        storage: config.cart?.storage,
        behavior: config.cart?.behavior,
        pricing: config.cart?.pricing,
      },
    }),
  },
  // Example of how to add more providers:
  // {
  //   Component: WishlistProvider,
  //   isEnabled: (config) => Boolean(config.enableWishlist),
  //   getProps: (config) => ({
  //     storage: config.wishlist?.storage,
  //   }),
  // },
];

interface ProvidersComposerProps {
  config: ShopcoreConfig;
  children: React.ReactNode;
}

export const ProvidersComposer: React.FC<ProvidersComposerProps> = ({ config, children }) => {
  const enabledProviders = providers.filter((provider) => provider.isEnabled(config));

  const compose = (providers: ProviderConfig[], index: number): React.ReactNode => {
    if (index >= providers.length) return children;

    const provider = providers[index]!;
    return <provider.Component {...provider.getProps(config)}>{compose(providers, index + 1)}</provider.Component>;
  };

  return <>{compose(enabledProviders, 0)}</>;
};
