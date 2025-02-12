import { db } from "@/db/drizzle";
import { ProductPricesInsert } from "@/db/schema";
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

export async function getPrices(): Promise<ProductPricesInsert[]> {
  const products = await db.query.products.findMany();
  const supermarkets = await db.query.supermarkets.findMany();
  const productPrices: ProductPricesInsert[] = [];

  for (let i = 0; i < products.length; i++) {
    const micmId = products[i].micmId;
    if (!micmId) {
      continue;
    }
    const prices = await getPricesByProductId(micmId);

    const supermarketPrice = prices.find((price) => price.type === 1);
    if (!supermarketPrice) {
      continue;
    }

    supermarketPrice.markets.forEach((price) => {
      const smPrice = supermarkets.find(
        (supermarket) => supermarket.name === price.name
      );

      if (!smPrice) {
        console.log(price + " no existe");
        return;
      }

      productPrices.push({
        productId: products[i].id,
        supermarketId: smPrice.id,
        price: price.price + "",
      });
    });
  }

  return productPrices;
}

async function getPricesByProductId(productId: number) {
  try {
    console.log(
      `fetch https://preciosjustos.micm.gob.do/api/productos/${productId}`
    );
    const data = await fetch(
      `https://preciosjustos.micm.gob.do/api/productos/${productId}`,
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
