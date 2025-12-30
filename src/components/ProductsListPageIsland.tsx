"use client";

import type { ComponentProps } from "react";

import { AppProviders } from "@/components/AppProviders";
import { ProductsListPage } from "@/components/ProductsListPage";

export function ProductsListPageIsland(props: ComponentProps<typeof ProductsListPage>) {
  return (
    <AppProviders>
      <ProductsListPage {...props} />
    </AppProviders>
  );
}
