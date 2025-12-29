"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./Toast";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
