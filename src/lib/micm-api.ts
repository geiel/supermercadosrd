import { db } from "@/db/drizzle";
import { ProductPricesInsert, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

function convertToValidImageString(img: string | null) {
  if (!img) {
    return null;
  }

  return img.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function getProducts() {
  try {
    const data = await fetch(
      "https://preciosjustos.micm.gob.do/api/productos",
      {
        headers: {
          referer: "https://preciosjustos.micm.gob.do/",
        },
      }
    );

    const products = await data.json();

    return z
      .array(
        z
          .object({
            id: z.number(),
            name: z.string(),
            unit: z.string(),
            img: z.string().nullable(),
            priceAverages: z.number().array(),
          })
          .transform((product) => ({
            micmId: product.id,
            name: product.name,
            image: convertToValidImageString(product.img),
            unit: product.unit,
            priceAverages: product.priceAverages,
          }))
      )
      .parse(products);
  } catch (err) {
    console.log(err);
  }

  return [];
}

export async function getPrices() {
  const products = await db.query.products.findMany({
    with: {
      prices: {
        with: {
          supermarket: true,
        },
      },
    },
  });
  const supermarkets = await db.query.supermarkets.findMany();
  const productPricesToAdd: ProductPricesInsert[] = [];
  const productPricesToUpdate: number[] = [];

  for (let i = 0; i < products.length; i++) {
    const micmId = products[i].micmId;
    if (!micmId) {
      continue;
    }
    const prices = await getPricesByProductId(micmId);

    const supermarketPrice = prices.find((price) => price.type === 1);
    if (!supermarketPrice) {
      console.log(
        "eliminar id: " + products[i].id + " nombre: " + products[i].name
      );
      await deleteProduct(products[i].id);
      continue;
    }

    supermarketPrice.markets.forEach((price) => {
      const smPrice = supermarkets.find(
        (supermarket) => supermarket.name === price.name
      );

      if (!smPrice) {
        return;
      }

      if (!products[i].prices) {
        productPricesToAdd.push({
          productId: products[i].id,
          supermarketId: smPrice.id,
          price: price.price + "",
          fromDate: new Date(),
          toDate: new Date(),
        });
        return;
      }

      const existingProductPrice = products[i].prices.find(
        (proPrice) => proPrice.supermarket.name === price.name
      );

      if (!existingProductPrice) {
        productPricesToAdd.push({
          productId: products[i].id,
          supermarketId: smPrice.id,
          price: price.price + "",
          fromDate: new Date(),
          toDate: new Date(),
        });
        return;
      }

      if (Number(existingProductPrice.price) !== price.price) {
        productPricesToAdd.push({
          productId: products[i].id,
          supermarketId: smPrice.id,
          price: price.price + "",
          fromDate: new Date(),
          toDate: new Date(),
        });
        return;
      }

      productPricesToUpdate.push(existingProductPrice.id);
    });
  }

  return { productPricesToAdd, productPricesToUpdate };
}

async function getPricesByProductId(micmId: number) {
  try {
    console.log(
      `fetch https://preciosjustos.micm.gob.do/api/productos/${micmId}`
    );
    const data = await fetch(
      `https://preciosjustos.micm.gob.do/api/productos/${micmId}`,
      {
        headers: {
          referer: "https://preciosjustos.micm.gob.do/",
        },
      }
    );

    const prices = await data.json();

    return z
      .array(
        z.object({
          type: z.number(),
          markets: z.array(
            z.object({
              name: z.string(),
              price: z.number(),
            })
          ),
        })
      )
      .parse(prices);
  } catch (err) {
    console.log(err);
  }

  return [];
}

async function deleteProduct(productId: number) {
  await db.delete(products).where(eq(products.id, productId));
}
