import { db } from "@/db/drizzle";
import puppeteer from "puppeteer";

export async function getSirenaPrice() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const urls = await db.query.supermarketProductsUrls.findMany({
    where: (supermarketProductsUrls, { eq, isNotNull, and }) =>
      and(
        eq(supermarketProductsUrls.supermarketId, 2),
        isNotNull(supermarketProductsUrls.url)
      ),
  });

  for (const supermarketProductsUrl of urls) {
    await page.goto(supermarketProductsUrl.url, { waitUntil: "networkidle2" });

    const price = await page.evaluate(() => {
      return document.querySelector(".item-product-price")?.textContent;
    });

    console.log(price);
  }
}
