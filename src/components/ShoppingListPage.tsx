"use client";

import { useEffect, useMemo, useState } from "react";

import type { ProductDto } from "@/types";
import { getRecentProductsFiltered } from "@/lib/services/products-client.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoadState = { status: "idle" | "loading" } | { status: "error"; message: string } | { status: "success" };

function formatExpirationDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pl-PL");
}

function statusLabel(status: ProductDto["status"]): string {
  if (status === "active") return "w lodówce";
  if (status === "draft") return "szkic";
  if (status === "spoiled") return "zepsute";
  return status;
}

function statusVariant(status: ProductDto["status"]): "default" | "secondary" | "destructive" {
  if (status === "spoiled") return "destructive";
  if (status === "draft") return "secondary";
  return "default";
}

export function ShoppingListPage() {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [products, setProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ status: "loading" });

      try {
        const result = await getRecentProductsFiltered(50, { to_buy: true });
        if (cancelled) return;
        setProducts(result);
        setState({ status: "success" });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Nie udało się pobrać listy zakupów";
        setState({ status: "error" as const, message });
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const content = useMemo(() => {
    if (state.status === "loading" || state.status === "idle") {
      return <p className="text-muted-foreground">Ładowanie…</p>;
    }

    if (state.status === "error") {
      return (
        <p className="text-destructive" role="alert">
          {state.message}
        </p>
      );
    }

    if (products.length === 0) {
      return <p className="text-muted-foreground">Brak produktów do kupienia.</p>;
    }

    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{product.name}</CardTitle>
                  {product.brand ? <p className="text-sm text-muted-foreground truncate">{product.brand}</p> : null}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Badge variant="secondary">do kupienia</Badge>
                  <Badge variant={statusVariant(product.status)}>{statusLabel(product.status)}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Ilość</dt>
                  <dd className="font-medium">
                    {product.quantity} {product.unit}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Termin</dt>
                  <dd className="font-medium">{formatExpirationDate(product.expiration_date)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Kod kreskowy</dt>
                  <dd className="font-medium">{product.barcode ?? "—"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }, [products, state]);

  return <section aria-label="Lista zakupów">{content}</section>;
}
