import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  primaryKey,
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
    productId: integer()
      .references(() => products.id)
      .notNull(),
    supermarketId: integer()
      .references(() => supermarkets.id)
      .notNull(),
    price: numeric().notNull(),
  },
  (table) => [primaryKey({ columns: [table.productId, table.supermarketId] })]
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
}));

export type SelectProduct = typeof products.$inferSelect;

export type ProductPricesInsert = typeof productPrices.$inferInsert;
export type ProductPricesSelect = typeof productPrices.$inferSelect;
