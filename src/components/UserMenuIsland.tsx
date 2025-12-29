"use client";

import type { ComponentProps } from "react";

import { AppProviders } from "./AppProviders";
import { UserMenu } from "./UserMenu";

export function UserMenuIsland(props: ComponentProps<typeof UserMenu>) {
  return (
    <AppProviders>
      <UserMenu {...props} />
    </AppProviders>
  );
}
