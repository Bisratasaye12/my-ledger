import { Layout } from './components/Layout';
import { InventoryTable } from './components/InventoryTable';
import { useInventory } from './hooks/useInventory';

export default function App() {
  const { items } = useInventory();

  return (
    <Layout>
      <InventoryTable items={items} />
    </Layout>
  );
}
