import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, MapPin, MessageCircle, CalendarCheck } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { CATEGORY_LABELS } from "@/data/catalog";
import { formatGhs, buildWhatsAppUrl, requiresBankTransferOrDeposit } from "@/lib/ghana";
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const highTicket = requiresBankTransferOrDeposit(product.priceGhs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/#catalog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </Link>

      <div className="mt-6 grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {CATEGORY_LABELS[product.category]}
            </span>
            {product.liRegulation && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Energy Commission {product.liRegulation}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Brand: {product.brand} • SKU: {product.sku}
            {product.ecRegNumber ? ` • EC Reg: ${product.ecRegNumber}` : ""}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {product.description}
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {formatGhs(product.priceGhs)}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {product.warrantyYears}-Year Warranty
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600">
              {highTicket
                ? "Exceeds standard MoMo daily limits — pay 30% booking deposit via MoMo or full amount via Paystack Bank Transfer."
                : "Eligible for instant MTN MoMo, Telecel Cash, Bank Transfer, or Card."}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-600" />
              Accra Central Hub: <strong>{product.stockAccra} in stock</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Kumasi Nhyiaeso: <strong>{product.stockKumasi} in stock</strong>
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton product={product} />
            <Link
              href="/checkout?mode=audit"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <CalendarCheck className="h-4 w-4 text-emerald-600" />
              Book Site Audit (GHS 400)
            </Link>
            <a
              href={buildWhatsAppUrl(
                `Hello Voltex Solar, I'm interested in ${product.name} (${product.sku}) listed at ${formatGhs(product.priceGhs)}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              <MessageCircle className="h-4 w-4" />
              Ask Engineer
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
            Technical Specifications
          </h2>
          <dl className="mt-4 divide-y divide-slate-200 text-sm">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 py-2.5">
                <dt className="font-medium text-slate-600">{key}</dt>
                <dd className="text-right font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
