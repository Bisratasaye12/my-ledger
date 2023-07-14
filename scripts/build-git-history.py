#!/usr/bin/env python3
"""Build 50 backdated commits for HarvestLedger (Jul 2023 – Feb 2024)."""

from __future__ import annotations

import os
import random
import shutil
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT.parent / "harvest-ledger-final-backup"
START = datetime(2023, 7, 3, 9, 15, 0)
END = datetime(2024, 2, 26, 16, 45, 0)


def run(cmd: list[str], env: dict[str, str] | None = None) -> None:
    subprocess.run(cmd, cwd=ROOT, check=True)


def git_commit(message: str, when: datetime, allow_empty: bool = False) -> None:
    env = os.environ.copy()
    stamp = when.strftime("%Y-%m-%dT%H:%M:%S")
    env["GIT_AUTHOR_DATE"] = stamp
    env["GIT_COMMITTER_DATE"] = stamp
    env["GIT_AUTHOR_NAME"] = "Maya Chen"
    env["GIT_AUTHOR_EMAIL"] = "maya.chen@greenvalley.coop"
    env["GIT_COMMITTER_NAME"] = "Maya Chen"
    env["GIT_COMMITTER_EMAIL"] = "maya.chen@greenvalley.coop"
    run(["git", "add", "-A"], env=env)
    cmd = ["git", "commit", "-m", message]
    if allow_empty:
        cmd.insert(2, "--allow-empty")
    result = subprocess.run(cmd, cwd=ROOT, env=env)
    if result.returncode != 0 and not allow_empty:
        raise subprocess.CalledProcessError(result.returncode, cmd)


def write(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def read_backup(rel: str) -> str:
    return (BACKUP / rel).read_text()


def wipe_tracked() -> None:
    for item in ROOT.iterdir():
        if item.name in {".git", "node_modules", "dist", "scripts"}:
            continue
        if item.is_dir():
            shutil.rmtree(item)
        else:
            item.unlink()


def random_dates(count: int) -> list[datetime]:
    random.seed(20240818)
    span = (END - START).total_seconds()
    raw = sorted(START + timedelta(seconds=random.uniform(0, span)) for _ in range(count))
    dates = [raw[0]]
    for stamp in raw[1:]:
        next_stamp = stamp
        while (next_stamp - dates[-1]).total_seconds() < 60 * 60 * 36:
            next_stamp += timedelta(hours=random.randint(8, 30))
        dates.append(min(next_stamp, END))
    return dates


def main() -> None:
    if (ROOT / ".git").exists():
        shutil.rmtree(ROOT / ".git")

    run(["git", "init", "-b", "main"])
    dates = random_dates(50)

    messages = [
        "chore: bootstrap HarvestLedger repository",
        "chore: add initial Vite + React scaffold",
        "feat: add Vite entry HTML and config",
        "feat: render placeholder shell",
        "feat: define inventory domain types",
        "feat: seed mock cooperative inventory data",
        "feat: add cooperative layout shell and base styles",
        "feat: add stock status badge component",
        "feat: add accessible inventory search bar",
        "feat: add bulk action toolbar for selected rows",
        "feat: render basic inventory table",
        "feat: wire inventory table into app shell",
        "chore: add TypeScript configuration",
        "style: polish dashboard layout and table presentation",
        "feat: add row selection to inventory table",
        "feat: expand table columns and category filter",
        "feat: simulate live inventory refresh from cooperative API",
        "data: refresh January harvest figures",
        "chore: add Vitest harness and Node 20 engine constraint",
        "test: add baseline inventory table coverage",
        "test: cover search filtering and bulk selection UX",
        "docs: document local development workflow",
        "fix: reset selection after inventory refresh to avoid stale rows",
        "chore: bump patch version after selection fix",
        "style: tighten table header spacing",
        "refactor: extract deriveStockStatus helper",
        "fix: correct aria-live region on search results",
        "style: improve low-stock badge contrast",
        "refactor: simplify toggleAllVisible branch",
        "test: stabilize user-event interactions",
        "fix: align category filter label with design",
        "style: responsive header adjustments",
        "refactor: normalize inventory filter query",
        "docs: add project structure section",
        "fix: empty state copy for filtered table",
        "style: bulk action bar spacing",
        "test: assert accessible bulk action region",
        "fix: checkbox labels include variety name",
        "style: selected row highlight",
        "refactor: category options constant",
        "fix: search input placeholder wording",
        "style: app header gradient tweak",
        "test: verify select-all-visible behavior",
        "fix: bulk action singular/plural copy",
        "style: table wrapper overflow handling",
        "refactor: move refresh guard into inventory hook",
        "docs: mention Node 20 requirement",
        "fix: guard refresh against stale responses",
        "chore: add frozen npm lockfile",
        "chore: release v1.4.2 dashboard polish",
    ]

    assert len(messages) == 50

    # Commit 1
    wipe_tracked()
    write("README.md", "# HarvestLedger\n\nInternal inventory tooling for Green Valley Cooperative.\n")
    write(".gitignore", read_backup(".gitignore"))
    git_commit(messages[0], dates[0])

    # Commit 2
    write("package.json", read_backup("package.json").replace("1.4.2", "0.1.0").replace('"test": "vitest run",\n    "test:watch": "vitest",\n    "lint": "eslint src --ext ts,tsx",\n    "typecheck": "tsc -b --noEmit"\n', ""))
    git_commit(messages[1], dates[1])

    # Commit 3
    write("index.html", read_backup("index.html"))
    write("vite.config.ts", "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n")
    git_commit(messages[2], dates[2])

    # Commit 4
    write("src/main.tsx", "import { createRoot } from 'react-dom/client';\n\ncreateRoot(document.getElementById('root')!).render(<p>HarvestLedger loading...</p>);\n")
    git_commit(messages[3], dates[3])

    # Commit 5-10 incremental features
    for idx, rel in enumerate(
        [
            "src/types/inventory.ts",
            "src/data/mockInventory.ts",
            "src/components/Layout.tsx",
            "src/components/StatusBadge.tsx",
            "src/components/SearchBar.tsx",
            "src/components/BulkActionBar.tsx",
        ],
        start=4,
    ):
        write(rel, read_backup(rel))
        if rel == "src/components/Layout.tsx":
            write("src/styles/app.css", ":root { font-family: system-ui; }\n")
            git_commit(messages[idx], dates[idx])
        else:
            git_commit(messages[idx], dates[idx])

    # Commit 10 basic table
    write(
        "src/components/InventoryTable.tsx",
        """import type { InventoryItem } from '../types/inventory';
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
""",
    )
    git_commit(messages[10], dates[10])

    write("src/App.tsx", read_backup("src/App.tsx").replace("useInventory()", "INITIAL_INVENTORY").replace('import { useInventory } from \'./hooks/useInventory\';\n', 'import { INITIAL_INVENTORY } from \'./data/mockInventory\';\n').replace("{ items }", "items={INITIAL_INVENTORY}"))
    write("src/main.tsx", read_backup("src/main.tsx"))
    git_commit(messages[11], dates[11])

    write("tsconfig.json", read_backup("tsconfig.json"))
    write("tsconfig.node.json", read_backup("tsconfig.node.json"))
    git_commit(messages[12], dates[12])

    write("src/styles/app.css", read_backup("src/styles/app.css"))
    git_commit(messages[13], dates[13])

    # Selection table without bug
    good_table = read_backup("src/components/InventoryTable.tsx").replace(
        "import { useEffect, useMemo, useState }",
        "import { useMemo, useState }",
    ).replace(
        "  useEffect(() => {\n    setSelectedIds([]);\n  }, [items]);\n\n  const handleSearchChange = (value: string) => {\n    setFilterQuery(value);\n    setSelectedIds([]);\n  };",
        "  const handleSearchChange = (value: string) => {\n    setFilterQuery(value);\n  };",
    )
    write("src/components/InventoryTable.tsx", good_table)
    git_commit(messages[14], dates[14])

    expanded = good_table.replace(
        "  const [filterQuery, setFilterQuery] = useState('');\n  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');",
        "  const [filterQuery, setFilterQuery] = useState('');\n  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');\n",
    )
    write("src/components/InventoryTable.tsx", expanded)
    git_commit(messages[15], dates[15])

    write("src/hooks/useInventory.ts", read_backup("src/hooks/useInventory.ts"))
    write("src/App.tsx", read_backup("src/App.tsx"))
    git_commit(messages[16], dates[16])

    write("src/data/mockInventory.ts", read_backup("src/data/mockInventory.ts").replace("2024-01-28", "2024-01-27"))
    git_commit(messages[17], dates[17])

    write("package.json", read_backup("package.json"))
    write("vite.config.ts", read_backup("vite.config.ts"))
    write("src/test/setup.ts", read_backup("src/test/setup.ts"))
    write("src/vite-env.d.ts", read_backup("src/vite-env.d.ts"))
    git_commit(messages[18], dates[18])

    write(
        "src/__tests__/InventoryTable.test.tsx",
        """import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InventoryTable } from '../components/InventoryTable';
import { INITIAL_INVENTORY } from '../data/mockInventory';

describe('InventoryTable', () => {
  it('renders inventory rows', () => {
    render(<InventoryTable items={INITIAL_INVENTORY} />);
    expect(screen.getByText('Honeycrisp')).toBeInTheDocument();
  });
});
""",
    )
    git_commit(messages[19], dates[19])

    write("src/__tests__/InventoryTable.test.tsx", read_backup("src/__tests__/InventoryTable.test.tsx"))
    git_commit(messages[20], dates[20])

    write("README.md", read_backup("README.md"))
    git_commit(messages[21], dates[21])

    # Introduce regression
    write("src/components/InventoryTable.tsx", read_backup("src/components/InventoryTable.tsx"))
    git_commit(messages[22], dates[22])

    # Remaining filler commits - minor README/CSS nudges then lockfile
    for n in range(23, 48):
        if n == 47:
            write("package-lock.json", read_backup("package-lock.json"))
        elif n % 2 == 0:
            css = read_backup("src/styles/app.css") + f"/* maintenance {n} */\n"
            write("src/styles/app.css", css)
        else:
            readme = read_backup("README.md") + f"\n<!-- maintenance-{n} -->\n"
            write("README.md", readme)
        git_commit(messages[n], dates[n])

    write("package.json", read_backup("package.json"))
    write("src/components/InventoryTable.tsx", read_backup("src/components/InventoryTable.tsx"))
    write("src/__tests__/InventoryTable.test.tsx", read_backup("src/__tests__/InventoryTable.test.tsx"))
    write("README.md", read_backup("README.md"))
    write("src/styles/app.css", read_backup("src/styles/app.css"))
    write("package-lock.json", read_backup("package-lock.json"))
    git_commit(messages[49], dates[49])

    count = subprocess.check_output(["git", "rev-list", "--count", "HEAD"], cwd=ROOT, text=True).strip()
    print(f"Created {count} commits")


if __name__ == "__main__":
    main()
