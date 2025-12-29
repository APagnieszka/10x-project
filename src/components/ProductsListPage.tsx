"use client";

import { useEffect, useMemo, useState } from "react";

import type { ProductDto } from "@/types";
import {
  deleteProduct,
  getRecentProducts,
  markProductOpened,
  markProductSpoiled,
} from "@/lib/services/products-client.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LoadState = { status: "idle" | "loading" } | { status: "error"; message: string } | { status: "success" };

function formatExpirationDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pl-PL");
}

function formatOpenedDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export function ProductsListPage() {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [status, setStatus] = useState<ProductDto["status"]>("active");
  const [actionProductId, setActionProductId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    function syncStatusFromUrl() {
      const value = new URLSearchParams(window.location.search).get("status");
      if (value === "draft" || value === "active" || value === "spoiled") {
        setStatus(value);
        return;
      }

      setStatus("active");
    }

    syncStatusFromUrl();
    window.addEventListener("popstate", syncStatusFromUrl);

    return () => {
      window.removeEventListener("popstate", syncStatusFromUrl);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ status: "loading" });

      try {
        const result = await getRecentProducts(50, status);
        if (cancelled) return;
        setProducts(result);
        setState({ status: "success" });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Nie udało się pobrać produktów";
        setState({ status: "error" as const, message });
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [status]);

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
      return <p className="text-muted-foreground">Brak produktów.</p>;
    }

    return (
      <div className="space-y-4">
        {actionError ? (
          <p className="text-destructive" role="alert">
            {actionError}
          </p>
        ) : null}
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{product.name}</CardTitle>
                  {product.brand ? <p className="text-sm text-muted-foreground truncate">{product.brand}</p> : null}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {status === "active" && product.opened ? (
                    <Badge className="border-transparent bg-chart-5 text-foreground dark:bg-chart-3 dark:text-primary-foreground">
                      otwarte
                    </Badge>
                  ) : null}
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

              {status === "active" && product.opened ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Data otwarcia: {formatOpenedDate(product.opened_date)}
                </p>
              ) : null}

              <div className="mt-4 flex gap-2">
                {status === "active" && !product.opened ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={actionProductId === product.id}
                    onClick={() => {
                      setActionError(null);
                      setActionProductId(product.id);
                      void (async () => {
                        try {
                          const updated = await markProductOpened(product.id);
                          setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
                        } catch (error) {
                          const message =
                            error instanceof Error ? error.message : "Nie udało się oznaczyć jako otwarte";
                          setActionError(message);
                        } finally {
                          setActionProductId(null);
                        }
                      })();
                    }}
                  >
                    Otwieram
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={actionProductId === product.id}
                  onClick={() => {
                    setActionError(null);
                    setActionProductId(product.id);
                    void (async () => {
                      try {
                        await deleteProduct(product.id);
                        setProducts((prev) => prev.filter((p) => p.id !== product.id));
                      } catch (error) {
                        const message = error instanceof Error ? error.message : "Nie udało się usunąć produktu";
                        setActionError(message);
                      } finally {
                        setActionProductId(null);
                      }
                    })();
                  }}
                >
                  Zjedzone
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={actionProductId === product.id}
                  onClick={() => {
                    setActionError(null);
                    setActionProductId(product.id);
                    void (async () => {
                      try {
                        await markProductSpoiled(product.id);
                        setProducts((prev) => prev.filter((p) => p.id !== product.id));
                      } catch (error) {
                        const message = error instanceof Error ? error.message : "Nie udało się oznaczyć jako zepsute";
                        setActionError(message);
                      } finally {
                        setActionProductId(null);
                      }
                    })();
                  }}
                >
                  Zepsute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }, [actionError, actionProductId, products, state, status]);

  return <section aria-label="Lista produktów">{content}</section>;
}
