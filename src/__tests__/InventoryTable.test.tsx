import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InventoryTable } from '../components/InventoryTable';
import { INITIAL_INVENTORY } from '../data/mockInventory';

describe('InventoryTable', () => {
  it('renders inventory rows', () => {
    render(<InventoryTable items={INITIAL_INVENTORY} />);
    expect(screen.getByText('Honeycrisp')).toBeInTheDocument();
  });
});
