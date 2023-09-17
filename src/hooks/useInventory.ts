import { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_INVENTORY, deriveStockStatus } from '../data/mockInventory';
import type { InventoryItem } from '../types/inventory';

const REFRESH_MS = 4500;

function applyRandomStockDrift(items: InventoryItem[]): InventoryItem[] {
  const index = Math.floor(Math.random() * items.length);
  const target = items[index];
  const delta = Math.floor(Math.random() * 40) - 15;
  const nextQuantity = Math.max(0, target.quantityLbs + delta);

  return items.map((item) =>
    item.id === target.id
      ? {
          ...item,
          quantityLbs: nextQuantity,
          status: deriveStockStatus(nextQuantity),
        }
      : item,
  );
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const requestIdRef = useRef(0);

  const refreshInventory = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    // Simulate network latency with occasional out-of-order responses
    const delay = 300 + Math.floor(Math.random() * 900);
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (requestId !== requestIdRef.current) {
      return;
    }

    setItems((current) => applyRandomStockDrift(current));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshInventory();
    }, REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [refreshInventory]);

  return { items, refreshInventory };
}
