import { Badge } from "@/components/ui/badge";
import { db } from "@/db/drizzle";
import { ProductPricesSelect } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

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
    <div className="flex flex-1 flex-col p-3 bg-muted">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid auto-rows-min gap-3 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <Link
              key={i}
              href={`/app/product/${product.id}`}
              className="flex flex-col gap-2 bg-white p-2 rounded-md"
            >
              <div className="aspect-square rounded-xl flex justify-center items-center">
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
              <p className="leading-6">{product.name}</p>
              <div className="font-bold text-2xl">
                <ProductPrice prices={product.prices} />
              </div>
            </Link>
          ))}
        </div>
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
