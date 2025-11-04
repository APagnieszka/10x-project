"use client";

import { ToastProvider } from "./Toast";
import { AuthProvider } from "./AuthContext";

interface ToastWrapperProps {
  children: React.ReactNode;
}

export function ToastWrapper({ children }: ToastWrapperProps) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
