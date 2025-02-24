"use server";

import { db } from "@/db/drizzle";
import { productPrices, products } from "@/db/schema";
import { getPrices, getProducts } from "@/lib/micm-api";
import { getJumboPrice } from "@/lib/scrappers/jumbo";
import { getNacionalPrice } from "@/lib/scrappers/nacional";
import { getSirenaPrice } from "@/lib/scrappers/sirena";
import { inArray, sql } from "drizzle-orm";

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
  const { productPricesToAdd, productPricesToUpdate } = await getPrices();

  console.log("Added " + productPricesToAdd.length);
  console.log("Updated " + productPricesToUpdate.length);

  if (productPricesToAdd.length > 0) {
    await db
      .insert(productPrices)
      .values(productPricesToAdd)
      .onConflictDoNothing();
  }

  await db
    .update(productPrices)
    .set({
      toDate: new Date(),
    })
    .where(inArray(productPrices.id, productPricesToUpdate));
}

export async function loadSirenaPrices() {
  const { productPricesToAdd, productPricesToUpdate } = await getSirenaPrice();

  console.log("Added " + productPricesToAdd.length);
  console.log("Updated " + productPricesToUpdate.length);

  if (productPricesToAdd.length > 0) {
    await db
      .insert(productPrices)
      .values(productPricesToAdd)
      .onConflictDoNothing();
  }

  await db
    .update(productPrices)
    .set({
      toDate: new Date(),
    })
    .where(inArray(productPrices.id, productPricesToUpdate));
}

export async function loadNacionalPrices() {
  const { productPricesToAdd, productPricesToUpdate } =
    await getNacionalPrice();

  console.log("Added " + productPricesToAdd.length);
  console.log("Updated " + productPricesToUpdate.length);

  if (productPricesToAdd.length > 0) {
    await db
      .insert(productPrices)
      .values(productPricesToAdd)
      .onConflictDoNothing();
  }

  await db
    .update(productPrices)
    .set({
      toDate: new Date(),
    })
    .where(inArray(productPrices.id, productPricesToUpdate));
}

export async function loadJumboPrices() {
  const { productPricesToAdd, productPricesToUpdate } = await getJumboPrice();

  console.log("Added " + productPricesToAdd.length);
  console.log("Updated " + productPricesToUpdate.length);

  // if (productPricesToAdd.length > 0) {
  //   await db
  //     .insert(productPrices)
  //     .values(productPricesToAdd)
  //     .onConflictDoNothing();
  // }

  // await db
  //   .update(productPrices)
  //   .set({
  //     toDate: new Date(),
  //   })
  //   .where(inArray(productPrices.id, productPricesToUpdate));
}
