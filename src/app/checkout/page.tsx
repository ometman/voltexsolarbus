"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Landmark,
  Smartphone,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  DEPOSIT_PERCENTAGE,
  MOMO_DAILY_LIMITS_GHS,
  SITE_AUDIT_FEE_GHS,
  formatGhs,
} from "@/lib/ghana";

type PaymentMode = "FULL" | "MILESTONE" | "SITE_AUDIT";
type Channel = "MOMO_MTN" | "MOMO_TELECEL" | "MOMO_AT" | "BANK_TRANSFER" | "CARD";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "audit" ? "SITE_AUDIT" : "FULL";
  const statusParam = searchParams.get("status");
  const refParam = searchParams.get("ref");

  const { items, subtotalGhs, updateQuantity, removeItem, clearCart } = useCart();

  const [paymentMode, setPaymentMode] = useState<PaymentMode>(initialMode);
  const [channel, setChannel] = useState<Channel>("BANK_TRANSFER");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [region, setRegion] = useState("Greater Accra");
  const [address, setAddress] = useState("");
  const [ghanaPostGps, setGhanaPostGps] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAudit = paymentMode === "SITE_AUDIT";
  const totalGhs = isAudit ? SITE_AUDIT_FEE_GHS : subtotalGhs;
  const amountDueNowGhs =
    paymentMode === "MILESTONE"
      ? Math.round(totalGhs * DEPOSIT_PERCENTAGE)
      : totalGhs;

  const exceedsTier2Momo = amountDueNowGhs > MOMO_DAILY_LIMITS_GHS.TIER_2_MED;
  const exceedsTier3Momo = amountDueNowGhs > MOMO_DAILY_LIMITS_GHS.TIER_3_ENHANCED;

  useEffect(() => {
    if (!isAudit && subtotalGhs > MOMO_DAILY_LIMITS_GHS.TIER_2_MED && channel.startsWith("MOMO_")) {
      setChannel("BANK_TRANSFER");
    }
  }, [isAudit, subtotalGhs, channel]);

  useEffect(() => {
    if (statusParam === "simulated_success" || statusParam === "callback") {
      clearCart();
    }
  }, [statusParam, clearCart]);

  if (statusParam === "simulated_success" || statusParam === "callback") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          Order &amp; Payment Reference Recorded
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Reference: <strong className="text-slate-900">{refParam}</strong>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Our Accra/Kumasi engineering desk will confirm your dispatch or site audit
          window via WhatsApp and SMS.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          region,
          address,
          ghanaPostGps,
          paymentMode,
          channel,
          items: isAudit
            ? []
            : items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        authorizationUrl?: string;
      };

      if (!res.ok || !data.authorizationUrl) {
        setError(data.error || "Unable to initialize payment.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.authorizationUrl;
    } catch {
      setError("Network error while initializing Paystack checkout.");
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Left: Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-extrabold text-slate-900">
            {isAudit ? "Book Engineering Site Audit" : "Ghana Checkout & Pro-Forma"}
          </h1>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 print:hidden"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Pro-Forma
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              { id: "FULL", label: "Full Payment", sub: "100% upfront" },
              { id: "MILESTONE", label: "30% Deposit", sub: "Lock price & stock" },
              { id: "SITE_AUDIT", label: "Site Audit Only", sub: "GHS 400 flat fee" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMode(m.id)}
              className={`rounded-xl border p-3 text-left transition ${
                paymentMode === m.id
                  ? "border-amber-500 bg-amber-50/70 ring-1 ring-amber-500"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="block text-xs font-bold text-slate-900">{m.label}</span>
              <span className="block text-[11px] text-slate-500">{m.sub}</span>
            </button>
          ))}
        </div>

        {/* Customer Details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Full Name / Business Name *
            </label>
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Kwame Mensah / Mensah Pharmacy"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              WhatsApp / Mobile Number *
            </label>
            <input
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="024 000 0000"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Email (for Receipt &amp; Pro-Forma)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="kwame@example.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Region *
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option>Greater Accra</option>
              <option>Ashanti Region (Kumasi)</option>
              <option>Eastern Region</option>
              <option>Central Region</option>
              <option>Western Region</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Street Address / Landmark *
            </label>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="East Legon / Nhyiaeso"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              GhanaPost GPS (Optional)
            </label>
            <input
              value={ghanaPostGps}
              onChange={(e) => setGhanaPostGps(e.target.value)}
              placeholder="GA-123-4567"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Payment Channel */}
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Select Payment Channel (Paystack GHS)
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setChannel("BANK_TRANSFER")}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold ${
                channel === "BANK_TRANSFER"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 text-slate-800"
              }`}
            >
              <Landmark className="h-4 w-4 shrink-0" />
              Pay with Bank Transfer (No MoMo Cap)
            </button>
            <button
              type="button"
              disabled={exceedsTier3Momo}
              onClick={() => setChannel("MOMO_MTN")}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                channel === "MOMO_MTN"
                  ? "border-amber-500 bg-amber-500 text-slate-950"
                  : "border-slate-300 text-slate-800"
              }`}
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              MTN MoMo / Telecel Cash
            </button>
          </div>

          {exceedsTier2Momo && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>
                <strong>Ghana MoMo Limit Notice:</strong> Amount due now (
                {formatGhs(amountDueNowGhs)}) exceeds standard Tier 2 MoMo daily limits
                (GHS 15,000; Tier 3 max GHS 25,000). Use{" "}
                <strong>Pay with Bank Transfer</strong> or switch to a{" "}
                <strong>30% Deposit</strong>.
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || (!isAudit && items.length === 0)}
          className="w-full rounded-lg bg-amber-500 px-5 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Initializing Paystack..."
            : `Pay ${formatGhs(amountDueNowGhs)} via Paystack`}
        </button>
      </form>

      {/* Right: Summary */}
      <div className="space-y-4 lg:col-span-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

          {isAudit ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900">
                Turnkey Engineering Site Audit
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Includes roof structural inspection, shading &amp; earthing test, and
                exact BOM verification. Fee is credited toward your installation.
              </p>
              <p className="mt-3 text-lg font-extrabold text-slate-900">
                {formatGhs(SITE_AUDIT_FEE_GHS)}
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-4 text-sm text-slate-500">
              Your cart is empty.{" "}
              <Link href="/#catalog" className="font-semibold text-amber-600 underline">
                Browse solar hardware
              </Link>
              .
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.product.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatGhs(item.product.priceGhs)} each
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="h-6 w-6 rounded border border-slate-300 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="h-6 w-6 rounded border border-slate-300 text-xs font-bold"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="ml-2 text-slate-400 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">
                    {formatGhs(item.product.priceGhs * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Total Quote Value</span>
              <span className="font-semibold text-slate-900">
                {formatGhs(totalGhs)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900">
              <span>Due Now</span>
              <span className="text-amber-600">{formatGhs(amountDueNowGhs)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Quote valid for 7 days • Energy Commission L.I. 2449/2452/2461 verified
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
