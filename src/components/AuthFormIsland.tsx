"use client";

import type { ComponentProps } from "react";

import { AppProviders } from "./AppProviders";
import { AuthForm } from "./AuthForm";

export function AuthFormIsland(props: ComponentProps<typeof AuthForm>) {
  return (
    <AppProviders>
      <AuthForm {...props} />
    </AppProviders>
  );
}
