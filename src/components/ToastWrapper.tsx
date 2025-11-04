"use client";

import { ToastProvider } from "./Toast";

interface ToastWrapperProps {
  children: React.ReactNode;
}

export function ToastWrapper({ children }: ToastWrapperProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
