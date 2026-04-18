import { Product, VaultEntry } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Kitenge Pulse Hoodie',
    sku: 'UG-24-001',
    price: 85,
    category: 'HOODIES',
    imageUrl: 'https://picsum.photos/seed/hoodie1/400/500',
    description: 'Heavyweight cotton with ancestral Kitenge geometry.',
    isNew: true,
    stockStatus: 'IN_STOCK'
  },
  {
    id: '2',
    name: 'Stencil Truth Tee',
    sku: 'UG-24-042',
    price: 45,
    category: 'TEES',
    imageUrl: 'https://picsum.photos/seed/tee1/400/500',
    description: 'Heavyweight cotton / Screen printed.',
    isLimited: true,
    stockStatus: 'IN_STOCK'
  },
  {
    id: '3',
    name: 'City Stencil Cargo',
    sku: 'UG-24-088',
    price: 120,
    category: 'ARCHIVE',
    imageUrl: 'https://picsum.photos/seed/cargo1/400/500',
    description: 'Utility pockets with reflective graffiti stencil.',
    stockStatus: 'IN_STOCK'
  },
  {
    id: '4',
    name: 'Roots Kanga Hoodie',
    sku: 'UG-24-002',
    price: 85,
    category: 'HOODIES',
    imageUrl: 'https://picsum.photos/seed/hoodie2/400/500',
    description: 'Fleece / Embroidered patchwork.',
    stockStatus: 'SOLD_OUT'
  },
  {
    id: '5',
    name: 'Subway Ghost Hoodie',
    sku: 'UG-24-003',
    price: 95,
    category: 'HOODIES',
    imageUrl: 'https://picsum.photos/seed/hoodie3/400/500',
    description: '400GSM / Reflective ink.',
    isLimited: true,
    stockStatus: 'RESTOCKING'
  }
];

export const MOCK_VAULT: VaultEntry[] = [
  { id: 'v1', imageUrl: 'https://picsum.photos/seed/street1/400/400', handle: '@DAR_KID_X' },
  { id: 'v2', imageUrl: 'https://picsum.photos/seed/street2/400/400', handle: '@GRIOT_DRIP' },
  { id: 'v3', imageUrl: 'https://picsum.photos/seed/street3/400/400', handle: '@ZARI_STREETS' },
  { id: 'v4', imageUrl: 'https://picsum.photos/seed/street4/400/400', handle: '@COLLECTOR_255' }
];
