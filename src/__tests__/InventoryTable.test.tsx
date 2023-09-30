import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { InventoryTable } from '../components/InventoryTable';
import { INITIAL_INVENTORY } from '../data/mockInventory';

describe('InventoryTable', () => {
  it('renders inventory rows with accessible labels', () => {
    render(<InventoryTable items={INITIAL_INVENTORY} />);

    expect(screen.getByRole('heading', { name: /live inventory/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/select tomatoes cherry/i)).toBeInTheDocument();
    expect(screen.getByText('Honeycrisp')).toBeInTheDocument();
  });

  it('filters rows by crop name', async () => {
    const user = userEvent.setup();
    render(<InventoryTable items={INITIAL_INVENTORY} />);

    await user.type(screen.getByLabelText(/search crops/i), 'kale');

    expect(screen.getByText('Lacinato')).toBeInTheDocument();
    expect(screen.queryByText('Honeycrisp')).not.toBeInTheDocument();
    expect(screen.getByText(/showing 1 of 8 items/i)).toBeInTheDocument();
  });

  it('shows bulk actions when a row is selected', async () => {
    const user = userEvent.setup();
    render(<InventoryTable items={INITIAL_INVENTORY} />);

    await user.click(screen.getByLabelText(/select kale lacinato/i));

    expect(screen.getByRole('region', { name: /bulk actions/i })).toBeInTheDocument();
    expect(screen.getByText(/1 item selected/i)).toBeInTheDocument();
  });

  it('selects and deselects all visible rows', async () => {
    const user = userEvent.setup();
    render(<InventoryTable items={INITIAL_INVENTORY} />);

    await user.click(screen.getByLabelText(/select all visible rows/i));

    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
    rowCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    await user.click(screen.getByLabelText(/select all visible rows/i));

    rowCheckboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });
});
