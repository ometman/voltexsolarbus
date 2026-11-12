import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-base font-bold text-white">Voltex Solar Ghana Ltd.</h3>
          <p className="mt-2 text-sm text-slate-400">
            Tier-1 solar panels, LiFePO4 storage, and hybrid inverters engineered for
            Greater Accra &amp; Ashanti Region.
          </p>
          <p className="mt-3 text-xs text-emerald-400">
            Compliant with Ghana Energy Commission L.I. 2449, L.I. 2452 &amp; L.I. 2461
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Fulfillment Hubs</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
            <li>Accra Central Hub — Greater Accra</li>
            <li>Kumasi Nhyiaeso Dispatch — Ashanti Region</li>
            <li>Port Clearance: Tema Bonded Logistics</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Quick Links &amp; Payments</h4>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <Link href="/calculator" className="hover:text-amber-400">
                Interactive Solar Load Calculator
              </Link>
            </li>
            <li>
              <Link href="/checkout?mode=audit" className="hover:text-amber-400">
                Book Engineering Site Audit (GHS 400)
              </Link>
            </li>
            <li className="pt-1 text-xs text-slate-400">
              Paystack: MTN MoMo • Telecel Cash • Bank Transfer • Visa/Mastercard
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
