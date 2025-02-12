import { Badge } from "@/components/ui/badge";
import { db } from "@/db/drizzle";
import { ProductPricesSelect } from "@/db/schema";
import Image from "next/image";

const bucketUrl =
  "https://ixfslclarqzcptjjuodm.supabase.co/storage/v1/object/public/product_images";

async function selectProducts() {
  return await db.query.products.findMany({
    with: {
      prices: true,
    },
  });
}

export default async function Page() {
  const products = await selectProducts();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {products.map((product, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square rounded-xl bg-muted flex justify-center items-center">
              <Image
                src={new URL(`${bucketUrl}/${product.image}`).toString()}
                alt={product.name}
                width={300}
                height={300}
                priority={false}
              />
            </div>
            <div>
              <Badge>{product.unit}</Badge>
            </div>
            <div>{product.name}</div>
            <div className="font-bold text-2xl">
              <ProductPrice prices={product.prices} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPrice({ prices }: { prices: ProductPricesSelect[] }) {
  if (prices.length === 0) {
    return "RD$0.00";
  }

  return `RD${prices[0].price}`;
}
