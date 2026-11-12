import { SolarCalculator } from "@/components/SolarCalculator";

export default function CalculatorPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Ghana Solar Load Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Size your inverter, LiFePO4 battery bank, and solar array based on your
          actual appliances, surge loads, and desired &ldquo;dumsor&rdquo; backup hours.
        </p>
      </div>

      <SolarCalculator />
    </main>
  );
}
