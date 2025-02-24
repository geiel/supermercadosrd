import { db } from "@/db/drizzle";
import { ProductPricesInsert } from "@/db/schema";
import puppeteer from "puppeteer";

const SUPERMARKET_ID = 7;

export async function getNacionalPrice() {
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
      `PROCESING NACIONAL ID: ${supermarketProductsUrl.product.id} NAME: ${supermarketProductsUrl.product.name}`
    );
    await page.goto(supermarketProductsUrl.url);

    const specialPrice = await page.evaluate(() => {
      return document.querySelector(".special-price .price")?.textContent;
    });
    const oldPrice = await page.evaluate(() => {
      return document.querySelector(".price")?.textContent;
    });

    const finalPrice = specialPrice ?? oldPrice;

    if (!finalPrice) {
      console.log(
        "Nacional price of the url " +
          supermarketProductsUrl.url +
          " was not found"
      );
      continue;
    }

    const cleanPrice = finalPrice
      .trim()
      .replaceAll("$", "")
      .replaceAll(",", "");
    if (
      Number(cleanPrice) !==
      Number(supermarketProductsUrl.product.prices[0].price)
    ) {
      console.log(
        `Product ${supermarketProductsUrl.product.name}: original: ${cleanPrice}, actual: ${supermarketProductsUrl.product.prices[0].price}`
      );

      productPricesToAdd.push({
        productId: supermarketProductsUrl.productId,
        supermarketId: supermarketProductsUrl.supermarketId,
        price: cleanPrice,
        fromDate: new Date(),
        toDate: new Date(),
      });

      continue;
    }

    productPricesToUpdate.push(supermarketProductsUrl.productId);
  }

  return { productPricesToAdd, productPricesToUpdate };
}
