"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@/lib/validation/products";
import { useProductForm } from "@/components/hooks/useProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreateProductCommand } from "@/types";

interface ToastFunctions {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

interface AddProductFormProps {
  initialData?: Partial<CreateProductCommand>;
  onSuccess?: () => void;
  onCancel?: () => void;
  toast?: ToastFunctions;
}

export function AddProductForm({ initialData, onSuccess, onCancel, toast }: AddProductFormProps) {
  const { isSubmitting, error, submitProduct } = useProductForm(toast);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      status: "draft",
      opened: false,
      to_buy: false,
      ...initialData,
      unit: (initialData?.unit as "kg" | "g" | "l" | "ml" | "pcs") || undefined,
    },
  });

  const opened = watch("opened");

  const onSubmit = async (data: CreateProductInput) => {
    const result = await submitProduct(data);

    if (result) {
      onSuccess?.();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Fill in the details to add a new product to your inventory.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} placeholder="Enter product name" />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" {...register("brand")} placeholder="Enter brand name" />
            {errors.brand && <p className="text-sm text-red-600">{errors.brand.message}</p>}
          </div>

          {/* Barcode */}
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input id="barcode" {...register("barcode")} placeholder="Enter barcode" />
            {errors.barcode && <p className="text-sm text-red-600">{errors.barcode.message}</p>}
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.quantity && <p className="text-sm text-red-600">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select onValueChange={(value) => setValue("unit", value as "kg" | "g" | "l" | "ml" | "pcs")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="l">l</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="pcs">pcs</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-sm text-red-600">{errors.unit.message}</p>}
            </div>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label htmlFor="expiration_date">Expiration Date *</Label>
            <Input id="expiration_date" type="date" {...register("expiration_date")} />
            {errors.expiration_date && <p className="text-sm text-red-600">{errors.expiration_date.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue("status", value as "draft" | "active" | "spoiled")}
              defaultValue="draft"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="spoiled">Spoiled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
          </div>

          {/* Opened */}
          <div className="flex items-center space-x-2">
            <input id="opened" type="checkbox" {...register("opened")} className="rounded" />
            <Label htmlFor="opened">Opened</Label>
          </div>

          {/* Opened Date - conditional */}
          {opened && (
            <div className="space-y-2">
              <Label htmlFor="opened_date">Opened Date</Label>
              <Input id="opened_date" type="datetime-local" {...register("opened_date")} />
              {errors.opened_date && <p className="text-sm text-red-600">{errors.opened_date.message}</p>}
            </div>
          )}

          {/* To Buy */}
          <div className="flex items-center space-x-2">
            <input id="to_buy" type="checkbox" {...register("to_buy")} className="rounded" />
            <Label htmlFor="to_buy">To Buy</Label>
          </div>

          {/* Main Image URL */}
          <div className="space-y-2">
            <Label htmlFor="main_image_url">Main Image URL</Label>
            <Input
              id="main_image_url"
              type="url"
              {...register("main_image_url")}
              placeholder="https://example.com/image.jpg"
            />
            {errors.main_image_url && <p className="text-sm text-red-600">{errors.main_image_url.message}</p>}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
