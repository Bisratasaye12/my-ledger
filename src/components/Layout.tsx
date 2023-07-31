import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__mark" aria-hidden="true">
            HL
          </span>
          <div>
            <p className="app-header__eyebrow">Green Valley Cooperative</p>
            <h1>HarvestLedger</h1>
          </div>
        </div>
        <p className="app-header__tagline">Produce inventory & bulk fulfillment dashboard</p>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
