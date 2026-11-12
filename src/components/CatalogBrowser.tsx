"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CatalogProduct, ProductCategoryType } from "@/data/catalog";
import { CATEGORY_LABELS } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

const FILTER_TABS: Array<{ key: "ALL" | ProductCategoryType; label: string }> = [
  { key: "ALL", label: "All Hardware & Bundles" },
  { key: "TURNKEY_BUNDLE", label: CATEGORY_LABELS.TURNKEY_BUNDLE },
  { key: "SOLAR_PANEL", label: CATEGORY_LABELS.SOLAR_PANEL },
  { key: "HYBRID_INVERTER", label: CATEGORY_LABELS.HYBRID_INVERTER },
  { key: "BATTERY_STORAGE", label: CATEGORY_LABELS.BATTERY_STORAGE },
];

export function CatalogBrowser({ products }: { products: CatalogProduct[] }) {
  const [activeCategory, setActiveCategory] = useState<"ALL" | ProductCategoryType>("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "ALL" || p.category === activeCategory;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.liRegulation?.toLowerCase().includes(q) ?? false);
      return matchesCategory && matchesQuery;
    });
  }, [products, activeCategory, query]);

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Energy Commission Compliant Catalog
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Real-time stock across Accra Central and Kumasi Nhyiaeso hubs.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Jinko, Deye, L.I. 2449..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const active = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
          No solar equipment matched your filter. Try clearing your search.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
