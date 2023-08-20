import type { InventoryItem } from '../types/inventory';
import { StatusBadge } from './StatusBadge';

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <table>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.crop}</td>
            <td><StatusBadge status={item.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
