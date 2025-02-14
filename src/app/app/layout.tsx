"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { List, Search } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <div className="flex justify-between w-full items-center">
              <SidebarTrigger />
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex relative justify-center items-center w-full max-w-5xl">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search size={18} />
                    </div>
                    <Input
                      placeholder="Buscar"
                      className="h-11 rounded-full pl-10 md:text-md"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  Hey yo
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon">
                <List />
              </Button>
            </div>
          </header>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
