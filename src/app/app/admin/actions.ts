"use server";

import { db } from "@/db/drizzle";
import { productPrices, products } from "@/db/schema";
import { getPrices, getProducts } from "@/lib/micm-api";
import { sql } from "drizzle-orm";

export async function updateMICMProducts() {
  const micmProducts = await getProducts();

  await db
    .insert(products)
    .values(micmProducts)
    .onConflictDoUpdate({
      target: products.micmId,
      set: {
        name: sql`excluded.name`,
        unit: sql`excluded.unit`,
        image: sql`excluded.image`,
      },
    });

  return "";
}

export async function setPrices() {
  const prices = await getPrices();

  await db
    .insert(productPrices)
    .values(prices)
    .onConflictDoUpdate({
      target: [productPrices.productId, productPrices.supermarketId],
      set: { price: sql`excluded.price` },
    });
}
