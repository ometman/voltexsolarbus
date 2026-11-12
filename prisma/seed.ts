import { PrismaClient } from "@prisma/client";
import { CATALOG_PRODUCTS } from "../src/data/catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Voltex Solar Ghana catalog into solardb...");

  for (const item of CATALOG_PRODUCTS) {
    await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        name: item.name,
        brand: item.brand,
        category: item.category,
        description: item.description,
        priceGhs: item.priceGhs,
        wattage: item.wattage,
        capacityKwh: item.capacityKwh,
        phase: item.phase,
        efficiencyPct: item.efficiencyPct,
        liRegulation: item.liRegulation,
        ecRegNumber: item.ecRegNumber,
        warrantyYears: item.warrantyYears,
        stockAccra: item.stockAccra,
        stockKumasi: item.stockKumasi,
        featured: item.featured,
        specs: item.specs,
      },
      create: {
        sku: item.sku,
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        category: item.category,
        description: item.description,
        priceGhs: item.priceGhs,
        wattage: item.wattage,
        capacityKwh: item.capacityKwh,
        phase: item.phase,
        efficiencyPct: item.efficiencyPct,
        liRegulation: item.liRegulation,
        ecRegNumber: item.ecRegNumber,
        warrantyYears: item.warrantyYears,
        stockAccra: item.stockAccra,
        stockKumasi: item.stockKumasi,
        featured: item.featured,
        specs: item.specs,
      },
    });
  }

  console.log(`Seeded ${CATALOG_PRODUCTS.length} Energy Commission compliant products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
