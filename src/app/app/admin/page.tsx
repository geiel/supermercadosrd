"use client";

import { Button } from "@/components/ui/button";
import {
  loadSupermaketsPrices,
  setPrices,
  updateMICMProducts,
} from "./actions";

export default function AdminPage() {
  return (
    <div className="container p-4 flex flex-col gap-4">
      <Button onClick={() => updateMICMProducts()}>Update Products</Button>
      <Button onClick={() => setPrices()}>Update Prices</Button>
      <Button onClick={() => loadSupermaketsPrices()}>
        Load Supermarket Prices
      </Button>
    </div>
  );
}
