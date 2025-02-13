import { relations, sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  numeric,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  micmId: integer().unique(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),
  unit: varchar({ length: 255 }).notNull(),
});

export const prodcutsRelations = relations(products, ({ many }) => ({
  prices: many(productPrices),
}));

export const supermarkets = pgTable("supermarkets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const supermarketRelations = relations(supermarkets, ({ many }) => ({
  prices: many(productPrices),
}));

export const productPrices = pgTable(
  "products_prices",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    productId: integer()
      .references(() => products.id)
      .notNull(),
    supermarketId: integer()
      .references(() => supermarkets.id)
      .notNull(),
    price: numeric().notNull(),
    fromDate: date({ mode: "date" }).notNull(),
    toDate: date({ mode: "date" }).notNull(),
  },
  (table) => [
    check("check_date_range", sql`${table.fromDate} <= ${table.toDate}`),
  ]
);

export const productPricesRelations = relations(productPrices, ({ one }) => ({
  product: one(products, {
    fields: [productPrices.productId],
    references: [products.id],
  }),
  supermarket: one(supermarkets, {
    fields: [productPrices.supermarketId],
    references: [supermarkets.id],
  }),
  url: one(supermarketProductsUrls, {
    fields: [productPrices.supermarketId, productPrices.productId],
    references: [
      supermarketProductsUrls.supermarketId,
      supermarketProductsUrls.productId,
    ],
  }),
}));

export const supermarketProductsUrls = pgTable("supermarket_products_urls", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer()
    .references(() => products.id)
    .notNull(),
  supermarketId: integer()
    .references(() => supermarkets.id)
    .notNull(),
  url: varchar({ length: 255 }).notNull(),
});

export const supermarketProductsUrlsRelations = relations(
  supermarketProductsUrls,
  ({ one }) => ({
    product: one(products, {
      fields: [supermarketProductsUrls.productId],
      references: [products.id],
    }),
    supermarket: one(supermarkets, {
      fields: [supermarketProductsUrls.supermarketId],
      references: [supermarkets.id],
    }),
  })
);

export type SelectProduct = typeof products.$inferSelect;

export type ProductPricesInsert = typeof productPrices.$inferInsert;
export type ProductPricesSelect = typeof productPrices.$inferSelect;
export type SupermarketProductUrlSelect =
  typeof supermarketProductsUrls.$inferSelect;
