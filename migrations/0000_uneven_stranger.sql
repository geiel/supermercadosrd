CREATE TABLE "products_prices" (
	"productId" integer NOT NULL,
	"supermarketId" integer NOT NULL,
	"price" numeric NOT NULL,
	CONSTRAINT "products_prices_productId_supermarketId_pk" PRIMARY KEY("productId","supermarketId")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"micmId" integer,
	"name" varchar(255) NOT NULL,
	"image" varchar(255),
	"unit" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supermarkets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "supermarkets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products_prices" ADD CONSTRAINT "products_prices_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_prices" ADD CONSTRAINT "products_prices_supermarketId_supermarkets_id_fk" FOREIGN KEY ("supermarketId") REFERENCES "public"."supermarkets"("id") ON DELETE no action ON UPDATE no action;