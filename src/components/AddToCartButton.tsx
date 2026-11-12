"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { CatalogProduct } from "@/data/catalog";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400"
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </>
      )}
    </button>
  );
}
