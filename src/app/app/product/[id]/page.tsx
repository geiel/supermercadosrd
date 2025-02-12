import { db } from "@/db/drizzle";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = (await params).id;
  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, Number(productId)),
    with: {
      prices: {
        with: {
          supermarket: true,
        },
      },
    },
  });

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div>
      {product.prices.map((price, key) => (
        <div key={key} className="flex gap-8">
          <div>{price.supermarket.name}</div>
          <div>RD${price.price}</div>
        </div>
      ))}
    </div>
  );
}
