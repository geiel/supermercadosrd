"use client";

import { useEffect } from "react";
import { useSidebar } from "./ui/sidebar";

export function ToogleSidebar({ open }: { open: boolean }) {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(open);
  });

  return null;
}
