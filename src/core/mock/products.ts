import { Product } from '../types/product';

/**
 * Mock products data for testing and development
 */
export const mockProducts: Product[] = [
  {
    id: 'prod_01',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description:
      'Experience crystal-clear sound with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
    price: 249.99,
    compareAtPrice: 299.99,
    currency: 'USD',
    inStock: true,
    quantity: 45,
    categories: ['Electronics', 'Audio'],
    tags: ['headphones', 'wireless', 'audio', 'premium'],
    images: [
      {
        id: 'img_01',
        url: 'https://example.com/images/headphones-1.jpg',
        alt: 'Black wireless headphones front view',
        isPrimary: true,
      },
      {
        id: 'img_02',
        url: 'https://example.com/images/headphones-2.jpg',
        alt: 'Black wireless headphones side view',
      },
      {
        id: 'img_03',
        url: 'https://example.com/images/headphones-3.jpg',
        alt: 'Black wireless headphones in case',
      },
    ],
    variants: [
      {
        id: 'var_01_black',
        name: 'Black',
        sku: 'HDPH-001-BLK',
        price: 249.99,
        inStock: true,
        quantity: 30,
        options: {
          color: 'Black',
        },
      },
      {
        id: 'var_01_white',
        name: 'White',
        sku: 'HDPH-001-WHT',
        price: 249.99,
        inStock: true,
        quantity: 10,
        options: {
          color: 'White',
        },
      },
      {
        id: 'var_01_blue',
        name: 'Blue',
        sku: 'HDPH-001-BLU',
        price: 269.99,
        inStock: true,
        quantity: 5,
        options: {
          color: 'Blue',
        },
      },
    ],
    rating: 4.8,
    reviewCount: 124,
    reviews: [
      {
        id: 'rev_01',
        author: 'John D.',
        rating: 5,
        title: "Best headphones I've ever owned",
        content:
          "The sound quality is incredible, and the noise cancellation works perfectly. Battery life is as advertised - I've gone a week of regular use without needing to charge.",
        createdAt: '2023-05-15T10:30:00Z',
        isVerified: true,
      },
      {
        id: 'rev_02',
        author: 'Sarah M.',
        rating: 4,
        title: 'Great sound, slightly tight fit',
        content:
          'Sound quality is excellent and the battery life is impressive. My only complaint is that they feel a bit tight after a few hours of use.',
        createdAt: '2023-04-22T14:15:00Z',
        isVerified: true,
      },
    ],
    relatedProducts: ['prod_05', 'prod_07'],
    attributes: {
      'batteryLife': '30 hours',
      'connectivity': 'Bluetooth 5.0',
      'noiseReduction': 'Active Noise Cancellation',
      'weight': '250g',
    },
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-06-10T11:30:00Z',
  },
  {
    id: 'prod_02',
    name: 'Fitness Smartwatch',
    slug: 'fitness-smartwatch',
    description:
      'Track your fitness goals with our advanced smartwatch. Features heart rate monitoring, GPS tracking, and 7-day battery life. Water-resistant up to 50 meters.',
    price: 199.99,
    compareAtPrice: 249.99,
    currency: 'USD',
    inStock: true,
    quantity: 28,
    categories: ['Electronics', 'Wearables', 'Fitness'],
    tags: ['smartwatch', 'fitness', 'wearable', 'health'],
    images: [
      {
        id: 'img_04',
        url: 'https://example.com/images/smartwatch-1.jpg',
        alt: 'Black fitness smartwatch front view',
        isPrimary: true,
      },
      {
        id: 'img_05',
        url: 'https://example.com/images/smartwatch-2.jpg',
        alt: 'Black fitness smartwatch side view',
      },
    ],
    variants: [
      {
        id: 'var_02_black',
        name: 'Black',
        sku: 'SWTCH-001-BLK',
        price: 199.99,
        inStock: true,
        quantity: 15,
        options: {
          color: 'Black',
        },
      },
      {
        id: 'var_02_silver',
        name: 'Silver',
        sku: 'SWTCH-001-SLV',
        price: 199.99,
        inStock: true,
        quantity: 13,
        options: {
          color: 'Silver',
        },
      },
    ],
    rating: 4.6,
    reviewCount: 89,
    reviews: [
      {
        id: 'rev_03',
        author: 'Michael T.',
        rating: 5,
        title: 'Perfect fitness companion',
        content:
          'This smartwatch has everything I need for tracking my workouts. The GPS is accurate and the heart rate monitor works great.',
        createdAt: '2023-04-10T09:45:00Z',
        isVerified: true,
      },
      {
        id: 'rev_04',
        author: 'Emma L.',
        rating: 4,
        title: 'Great features, app needs improvement',
        content:
          'The watch itself is excellent, but the companion app could use some work. Otherwise, very happy with my purchase.',
        createdAt: '2023-03-28T16:20:00Z',
        isVerified: true,
      },
    ],
    relatedProducts: ['prod_06', 'prod_07'],
    attributes: {
      'batteryLife': '7 days',
      'waterResistant': '50m',
      'sensors': 'Heart rate, GPS, Accelerometer',
      'compatibility': 'iOS, Android',
    },
    createdAt: '2023-02-05T10:15:00Z',
    updatedAt: '2023-05-20T14:30:00Z',
  },
];
