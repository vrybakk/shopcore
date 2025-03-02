import { Product, ShopcorePlugin } from 'shopcore';

/**
 * A simple plugin that applies a discount to all products
 */
export const discountPlugin: ShopcorePlugin = {
  id: 'discount-plugin',
  name: 'Discount Plugin',
  version: '1.0.0',
  description: 'Applies a 10% discount to all products',

  // Called when the plugin is mounted
  onMount: (config) => {
    console.log('Discount plugin mounted with config:', config);
  },

  // Called when the plugin is unmounted
  onUnmount: () => {
    console.log('Discount plugin unmounted');
  },

  // Modify product data
  onProductLoad: <T extends Product>(product: T): T => {
    // Skip if product is already on sale
    if (product.onSale || product.discountPercentage) {
      return product;
    }

    // Apply 10% discount
    const discountedProduct = {
      ...product,
      originalPrice: product.price,
      price: Number((product.price * 0.9).toFixed(2)),
      discountPercentage: 10,
      onSale: true,
    };

    return discountedProduct;
  },
};
