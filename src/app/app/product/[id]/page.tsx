import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/drizzle";
import { SupermarketProductUrlSelect } from "@/db/schema";
import Image from "next/image";

const bucketUrl =
  "https://ixfslclarqzcptjjuodm.supabase.co/storage/v1/object/public/product_images";

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
          url: true,
        },
        orderBy: (products, { asc }) => [asc(products.price)],
      },
    },
  });

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-10 px-4">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="flex flex-row">
          <div className="basis-1/2 lg:px-8 px-2">
            <div className="flex flex-col gap-2">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {product.name}
              </h3>
              <div>
                <Badge>{product.unit}</Badge>
              </div>
            </div>

            <div className="aspect-square rounded-xl flex justify-center items-center my-2">
              <Image
                src={new URL(`${bucketUrl}/${product.image}`).toString()}
                alt={product.name}
                width={500}
                height={500}
                priority={false}
              />
            </div>
          </div>
          <div className="basis-1/2 flex flex-col gap-8">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Donde Comprar
            </h3>
            <div>
              {product.prices.map((price, key) => (
                <div key={key}>
                  <div className="grid grid-cols-3 content-center items-center">
                    <div className="flex items-center h-11">
                      <SupermarketLogo name={price.supermarket.name} />
                    </div>
                    <div className="justify-self-end">
                      <div className="font-bold">RD${price.price}</div>
                    </div>
                    <div className="justify-self-end">
                      <VisitSupermarketButton url={price.url} />
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitSupermarketButton({ url }: { url: SupermarketProductUrlSelect }) {
  if (!url) {
    return <Button disabled={true}>Visitar</Button>;
  }

  return (
    <a
      href={url.url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant: "default" })}
    >
      Visitar
    </a>
  );
}

function SupermarketLogo({ name }: { name: string }) {
  if (name === "Nacional") {
    return (
      <Image
        src={`/supermarket-logo/nacional.webp`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  if (name === "Jumbo") {
    return (
      <Image
        src={`/supermarket-logo/jumbo.webp`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  if (name === "Pricesmart") {
    return (
      <Image
        src={`/supermarket-logo/pricesmart.svg`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  if (name === "La Sirena") {
    return (
      <Image
        src={`/supermarket-logo/sirena.svg`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  if (name === "Plaza Lama") {
    return (
      <Image
        src={`/supermarket-logo/plaza_lama.png`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  if (name === "Bravo") {
    return (
      <Image
        src={`/supermarket-logo/bravo.png`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  if (name === "Carrefour") {
    return (
      <Image
        src={`/supermarket-logo/carrefour.png`}
        alt={name}
        width={135}
        height={27}
      />
    );
  }

  if (name === "Ole") {
    return (
      <Image
        src={`/supermarket-logo/ole.png`}
        alt={name}
        width={75}
        height={27}
      />
    );
  }

  if (name === "La Cadena") {
    return (
      <Image
        src={`/supermarket-logo/la_cadena.png`}
        alt={name}
        width={90}
        height={27}
      />
    );
  }

  if (name === "Aprezio") {
    return (
      <Image
        src={`/supermarket-logo/aprezio.png`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  if (name === "Unidos") {
    return (
      <Image
        src={`/supermarket-logo/unidos.png`}
        alt={name}
        width={100}
        height={27}
      />
    );
  }

  return null;
}
