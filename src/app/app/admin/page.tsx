"use client";

import { Button } from "@/components/ui/button";
import {
  loadJumboPrices,
  loadNacionalPrices,
  loadSirenaPrices,
  setPrices,
  updateMICMProducts,
} from "./actions";

export default function AdminPage() {
  return (
    <div className="container p-4 flex flex-row gap-4">
      <Button onClick={() => updateMICMProducts()}>Update Products</Button>
      <Button onClick={() => setPrices()}>Update Prices</Button>
      <Button onClick={() => loadSirenaPrices()}>Load Sirena Prices</Button>
      <Button onClick={() => loadNacionalPrices()}>Load Nacional Prices</Button>
      <Button onClick={() => loadJumboPrices()}>Load Jumbo Prices</Button>
    </div>
  );
}
