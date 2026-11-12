"use client";

import Link from "next/link";
import { ShoppingCart, Sun, Calculator, ShieldCheck, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { buildWhatsAppUrl } from "@/lib/ghana";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-sm">
            <Sun className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-base font-bold leading-tight text-slate-900">
              Voltex Solar
            </span>
            <span className="block text-[11px] font-medium text-emerald-700">
              Ghana Energy Commission Compliant
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/#catalog" className="hover:text-amber-600">
            Catalog &amp; Bundles
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-1.5 hover:text-amber-600"
          >
            <Calculator className="h-4 w-4 text-amber-600" />
            Load Calculator
          </Link>
          <Link
            href="/checkout?mode=audit"
            className="flex items-center gap-1.5 hover:text-amber-600"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Book Site Audit
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={buildWhatsAppUrl(
              "Hello Voltex Solar Ghana, I need help sizing a solar system."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-emerald-600 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <Link
            href="/checkout"
            className="relative inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-slate-950">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile quick nav */}
      <div className="flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 md:hidden">
        <Link href="/#catalog" className="hover:text-amber-600">
          Catalog
        </Link>
        <Link href="/calculator" className="text-amber-700">
          Load Calculator
        </Link>
        <Link href="/checkout?mode=audit" className="text-emerald-700">
          Book Audit
        </Link>
      </div>
    </header>
  );
}
