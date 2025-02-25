import { db } from "@/db/drizzle";
import { ProductPricesInsert } from "@/db/schema";
import puppeteer from "puppeteer";

const SUPERMARKET_ID = 2;

export async function getSirenaPrice() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const urls = await db.query.supermarketProductsUrls.findMany({
    where: (supermarketProductsUrls, { eq, isNotNull, and }) =>
      and(
        eq(supermarketProductsUrls.supermarketId, SUPERMARKET_ID),
        isNotNull(supermarketProductsUrls.url)
      ),
    with: {
      product: {
        with: {
          prices: {
            where: (prices, { eq }) => eq(prices.supermarketId, SUPERMARKET_ID),
            orderBy: (prices, { desc }) => [desc(prices.fromDate)],
          },
        },
      },
    },
  });

  const productPricesToAdd: ProductPricesInsert[] = [];
  const productPricesToUpdate: number[] = [];

  for (const supermarketProductsUrl of urls) {
    console.log(
      `PROCESING SIRENA ID: ${supermarketProductsUrl.product.id} NAME: ${supermarketProductsUrl.product.name}`
    );
    await page.goto(supermarketProductsUrl.url, { waitUntil: "networkidle2" });

    const prices = await page.evaluate(() => {
      return document.querySelector(".item-product-price")?.textContent;
    });

    if (!prices) {
      console.log(
        "Sirena price of the url " +
          supermarketProductsUrl.url +
          " was not found"
      );
      continue;
    }

    const originalPrice = prices.split("$")[1];
    if (
      Number(originalPrice.replaceAll(",", "")) !==
      Number(supermarketProductsUrl.product.prices[0].price)
    ) {
      console.log(
        `Product ${supermarketProductsUrl.product.name}: original: ${originalPrice}, actual: ${supermarketProductsUrl.product.prices[0].price}`
      );

      productPricesToAdd.push({
        productId: supermarketProductsUrl.productId,
        supermarketId: supermarketProductsUrl.supermarketId,
        price: originalPrice,
        fromDate: new Date(),
        toDate: new Date(),
      });

      continue;
    }

    productPricesToUpdate.push(supermarketProductsUrl.productId);
  }

  return { productPricesToAdd, productPricesToUpdate };
}
