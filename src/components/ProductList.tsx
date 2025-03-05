import { useModifiedProducts, withPluginHooks } from '../core/context/ShopcoreContext';
import { Product } from '../core/types/product';
import ProductCardContainer from './ProductCard';

interface ProductListProps {
  products: Product[];
  className?: string;
}

/**
 * Base product list component that displays a grid of product cards
 */
function BaseProductList({ products, className = '' }: ProductListProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCardContainer
          key={product.id}
          product={product}
          onAddToCart={(product) => console.log('Added to cart:', product.name)}
        />
      ))}
    </div>
  );
}

/**
 * Enhanced product list with plugin hooks applied
 */
const EnhancedProductList = withPluginHooks('ProductList', BaseProductList);

/**
 * Product list container that applies plugin data hooks to the products
 */
export default function ProductList(props: ProductListProps) {
  // Apply plugin data hooks to modify the products
  const modifiedProducts = useModifiedProducts(props.products);

  // Pass the modified products to the enhanced component
  return <EnhancedProductList {...props} products={modifiedProducts} />;
}
