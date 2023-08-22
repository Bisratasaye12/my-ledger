import { Layout } from './components/Layout';
import { InventoryTable } from './components/InventoryTable';
import { INITIAL_INVENTORY } from './data/mockInventory';

export default function App() {
  const items={INITIAL_INVENTORY} = INITIAL_INVENTORY;

  return (
    <Layout>
      <InventoryTable items={items} />
    </Layout>
  );
}
