"use client";

import Link from "next/link";
import { ShieldCheck, MapPin, Plus, Check } from "lucide-react";
import { useState } from "react";
import type { CatalogProduct } from "@/data/catalog";
import { CATEGORY_LABELS } from "@/data/catalog";
import { formatGhs, requiresBankTransferOrDeposit } from "@/lib/ghana";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const highTicket = requiresBankTransferOrDeposit(product.priceGhs);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
            {CATEGORY_LABELS[product.category]}
          </span>
          {product.liRegulation && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {product.liRegulation}
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`} className="mt-3 block">
          <h3 className="text-base font-bold leading-snug text-slate-900 hover:text-amber-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {product.brand} • SKU: {product.sku}
        </p>

        <p className="mt-2.5 line-clamp-3 text-sm text-slate-600">
          {product.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            Accra: <strong>{product.stockAccra}</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            Kumasi: <strong>{product.stockKumasi}</strong>
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-extrabold text-slate-900">
            {formatGhs(product.priceGhs)}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {product.warrantyYears}yr warranty
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          {highTicket
            ? "Pay via 30% Deposit (MoMo) or Bank Transfer"
            : "Instant MTN MoMo / Telecel Cash / Card"}
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add to Cart
              </>
            )}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Specs
          </Link>
        </div>
      </div>
    </div>
  );
}
