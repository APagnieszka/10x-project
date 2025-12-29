"use client";

import type { ComponentProps } from "react";

import { AppProviders } from "@/components/AppProviders";
import { ShoppingListPage } from "@/components/ShoppingListPage";

export function ShoppingListPageIsland(props: ComponentProps<typeof ShoppingListPage>) {
  return (
    <AppProviders>
      <ShoppingListPage {...props} />
    </AppProviders>
  );
}
