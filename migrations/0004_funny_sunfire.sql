CREATE TABLE "supermarket_products_urls" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "supermarket_products_urls_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"productId" integer NOT NULL,
	"supermarketId" integer NOT NULL,
	"url" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "supermarket_products_urls" ADD CONSTRAINT "supermarket_products_urls_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supermarket_products_urls" ADD CONSTRAINT "supermarket_products_urls_supermarketId_supermarkets_id_fk" FOREIGN KEY ("supermarketId") REFERENCES "public"."supermarkets"("id") ON DELETE no action ON UPDATE no action;