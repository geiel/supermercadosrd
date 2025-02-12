"use client";

import { Button } from "@/components/ui/button";
import { setPrices, updateMICMProducts } from "./actions";

export default function AdminPage() {
  return (
    <div className="container p-4 flex flex-col gap-4">
      <Button onClick={() => updateMICMProducts()}>Update Products</Button>
      <Button onClick={() => setPrices()}>Update Prices</Button>
    </div>
  );
}
