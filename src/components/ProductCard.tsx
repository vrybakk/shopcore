import { useModifiedProduct, withPluginHooks } from '../core/context/ShopcoreContext';
import { Product } from '../core/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

/**
 * Product card component that displays a product with image, name, price, and add to cart button
 */
function BaseProductCard({ product, onAddToCart, className = '' }: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} data-product-id={product.id}>
      <div className='relative pb-[100%]'>
        <img src={product.image} alt={product.name} className='absolute inset-0 w-full h-full object-cover' />
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-semibold truncate'>{product.name}</h3>
        <div className='mt-1 flex items-center justify-between'>
          <span className='text-lg font-bold'>
            ${product.price.toFixed(2)}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className='ml-2 text-sm text-gray-500 line-through'>${product.originalPrice.toFixed(2)}</span>
            )}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className='mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors'
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/**
 * Enhanced product card with plugin hooks applied
 */
const ProductCard = withPluginHooks('ProductCard', BaseProductCard);

/**
 * Product card container that applies plugin data hooks to the product
 */
export function ProductCardContainer(props: ProductCardProps) {
  // Apply plugin data hooks to modify the product
  const modifiedProduct = useModifiedProduct(props.product);

  // Pass the modified product to the enhanced component
  return <ProductCard {...props} product={modifiedProduct} />;
}

export default ProductCardContainer;
