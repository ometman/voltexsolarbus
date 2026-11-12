import { prisma } from "@/lib/prisma";
import { CATALOG_PRODUCTS, type CatalogProduct, type ProductCategoryType } from "@/data/catalog";

export async function getProducts(category?: ProductCategoryType): Promise<CatalogProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        active: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ featured: "desc" }, { priceGhs: "asc" }],
    });

    if (rows.length > 0) {
      return rows.map((row) => ({
        id: row.id,
        sku: row.sku,
        slug: row.slug,
        name: row.name,
        brand: row.brand,
        category: row.category as ProductCategoryType,
        description: row.description,
        priceGhs: row.priceGhs,
        wattage: row.wattage,
        capacityKwh: row.capacityKwh,
        phase: row.phase,
        efficiencyPct: row.efficiencyPct,
        liRegulation: row.liRegulation,
        ecRegNumber: row.ecRegNumber,
        warrantyYears: row.warrantyYears,
        stockAccra: row.stockAccra,
        stockKumasi: row.stockKumasi,
        featured: row.featured,
        specs: (row.specs as Record<string, string>) ?? {},
      }));
    }
  } catch {
    // Graceful fallback to static catalog when solardb is not yet migrated/seeded
  }

  return category
    ? CATALOG_PRODUCTS.filter((item) => item.category === category)
    : CATALOG_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
