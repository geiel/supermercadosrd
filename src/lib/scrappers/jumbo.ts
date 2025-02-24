import { db } from "@/db/drizzle";
import { ProductPricesInsert } from "@/db/schema";
import puppeteer from "puppeteer";

const SUPERMARKET_ID = 6;

export async function getJumboPrice() {
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
      `PROCESING JUMBO ID: ${supermarketProductsUrl.product.id} NAME: ${supermarketProductsUrl.product.name}`
    );

    const response = await fetch(supermarketProductsUrl.url);
    const html = await response.text();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const specialPrice = await page.evaluate(() => {
      return document.querySelector(".special-price")?.textContent;
    });
    const oldPrice = await page.evaluate(() => {
      return document.querySelector(".price")?.textContent;
    });
    const oldPrice2 = await page.evaluate(() => {
      return document.querySelector(".product-purchase-price")?.textContent;
    });

    const finalPrice = specialPrice ?? oldPrice ?? oldPrice2;

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
      .replaceAll("RD$", "")
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
