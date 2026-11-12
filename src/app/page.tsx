import Link from "next/link";
import { ShieldCheck, Calculator, Zap, Landmark } from "lucide-react";
import { getProducts } from "@/lib/products";
import { CatalogBrowser } from "@/components/CatalogBrowser";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Ghana Energy Commission Certified (L.I. 2449 • 2452 • 2461)
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              End Dumsor &amp; Generator Bills with Tier-1 Solar in Ghana.
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Transparent GHS pricing, localized load sizing, and turnkey engineering
              for homes and SMEs across Greater Accra and Kumasi.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400"
              >
                <Calculator className="h-4 w-4" />
                Size Your System (Load Calculator)
              </Link>
              <Link
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Browse Solar Bundles
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 border-t border-slate-800 pt-8 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold">L.I. 2449 / 2452 / 2461</p>
                <p className="text-xs text-slate-400">
                  Registered modules, LFP batteries &amp; 50Hz pure sine inverters.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-semibold">MoMo &amp; Bank Transfer</p>
                <p className="text-xs text-slate-400">
                  30% booking deposits via MoMo or full Paystack Bank Transfer.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
              <div>
                <p className="text-sm font-semibold">Accra &amp; Kumasi Dispatch</p>
                <p className="text-xs text-slate-400">
                  Engineered site audits, aluminum rails &amp; Harmattan O&amp;M.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CatalogBrowser products={products} />
    </main>
  );
}
