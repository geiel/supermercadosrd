ALTER TABLE "products_prices" DROP CONSTRAINT "products_prices_productId_supermarketId_pk";--> statement-breakpoint
ALTER TABLE "products_prices" ADD COLUMN "id" integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "products_prices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "products_prices" ADD COLUMN "fromDate" date NOT NULL;--> statement-breakpoint
ALTER TABLE "products_prices" ADD COLUMN "toDate" date NOT NULL;--> statement-breakpoint
ALTER TABLE "products_prices" ADD CONSTRAINT "check_date_range" CHECK ("products_prices"."fromDate" < "products_prices"."toDate");