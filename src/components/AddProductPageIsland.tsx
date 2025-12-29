"use client";

import type { ComponentProps } from "react";

import { AppProviders } from "./AppProviders";
import { AddProductPage } from "./AddProductPage";

export function AddProductPageIsland(props: ComponentProps<typeof AddProductPage>) {
  return (
    <AppProviders>
      <AddProductPage {...props} />
    </AppProviders>
  );
}
