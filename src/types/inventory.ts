export type StockStatus = 'in-stock' | 'low' | 'out';

export interface InventoryItem {
  id: string;
  crop: string;
  variety: string;
  category: 'vegetable' | 'fruit' | 'grain' | 'herb';
  quantityLbs: number;
  unitPrice: number;
  harvestDate: string;
  status: StockStatus;
}

export type CategoryFilter = InventoryItem['category'] | 'all';
