import type { InventoryItem } from '../types/inventory';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'hl-001',
    crop: 'Tomatoes',
    variety: 'Cherry',
    category: 'vegetable',
    quantityLbs: 420,
    unitPrice: 2.4,
    harvestDate: '2024-01-27',
    status: 'in-stock',
  },
  {
    id: 'hl-002',
    crop: 'Kale',
    variety: 'Lacinato',
    category: 'vegetable',
    quantityLbs: 180,
    unitPrice: 3.1,
    harvestDate: '2024-01-30',
    status: 'in-stock',
  },
  {
    id: 'hl-003',
    crop: 'Apples',
    variety: 'Honeycrisp',
    category: 'fruit',
    quantityLbs: 95,
    unitPrice: 1.85,
    harvestDate: '2024-01-15',
    status: 'low',
  },
  {
    id: 'hl-004',
    crop: 'Basil',
    variety: 'Genovese',
    category: 'herb',
    quantityLbs: 32,
    unitPrice: 8.5,
    harvestDate: '2024-02-01',
    status: 'in-stock',
  },
  {
    id: 'hl-005',
    crop: 'Carrots',
    variety: 'Nantes',
    category: 'vegetable',
    quantityLbs: 310,
    unitPrice: 1.2,
    harvestDate: '2024-01-22',
    status: 'in-stock',
  },
  {
    id: 'hl-006',
    crop: 'Blueberries',
    variety: 'Duke',
    category: 'fruit',
    quantityLbs: 0,
    unitPrice: 4.75,
    harvestDate: '2024-01-10',
    status: 'out',
  },
  {
    id: 'hl-007',
    crop: 'Wheat',
    variety: 'Hard Red',
    category: 'grain',
    quantityLbs: 1200,
    unitPrice: 0.45,
    harvestDate: '2023-12-18',
    status: 'in-stock',
  },
  {
    id: 'hl-008',
    crop: 'Spinach',
    variety: 'Baby',
    category: 'vegetable',
    quantityLbs: 55,
    unitPrice: 4.2,
    harvestDate: '2024-02-02',
    status: 'low',
  },
];

export function deriveStockStatus(quantityLbs: number): InventoryItem['status'] {
  if (quantityLbs <= 0) return 'out';
  if (quantityLbs < 100) return 'low';
  return 'in-stock';
}
