// Database Entity Types (based on PostgreSQL schema)
export interface Households {
  id: number;
  name: string;
  timezone?: string;
  created_at: string;
}

export interface UserHouseholds {
  user_id: string;
  household_id: number;
}

export interface Products {
  id: number;
  household_id: number;
  name: string;
  brand?: string;
  barcode?: string;
  quantity: number;
  unit: string;
  expiration_date: string;
  status: "draft" | "active" | "spoiled";
  opened: boolean;
  to_buy: boolean;
  opened_date?: string;
  created_at: string;
  main_image_url?: string;
}

export interface ShoppingLists {
  id: number;
  household_id: number;
  name: string;
  created_at: string;
}

export interface ShoppingListItems {
  id: number;
  list_id: number;
  product_id: number;
  status: "to_buy" | "bought";
}

export interface Reports {
  id: number;
  household_id: number;
  start_date: string;
  unit: "day" | "week" | "month";
  length: number;
  spoiled_count: number;
  auto_generated?: boolean;
  details?: Record<string, unknown>;
}

export interface Images {
  id: number;
  product_id: number;
  bucket_name: "expiry-images" | "product-images";
  file_path: string;
  type: "expiry" | "product";
  uploaded_at: string;
}

export type ArchivedProducts = Products;

export interface ScansLog {
  id: number;
  household_id: number;
  operation_type: string;
  timestamp: string;
}

export interface AnalyticsEvents {
  id: number;
  household_id: number;
  event_type: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

// DTOs and Command Models

// Products
export type CreateProductCommand = Pick<
  Products,
  "name" | "brand" | "barcode" | "quantity" | "unit" | "expiration_date" | "main_image_url"
> & {
  status?: Products["status"];
  opened?: boolean;
  to_buy?: boolean;
  opened_date?: string;
};

export interface ProductDto extends Products {
  images?: ImageDto[];
}

export type UpdateProductCommand = Partial<CreateProductCommand>;

export interface MarkSpoiledCommand {
  remove_from_inventory?: boolean;
}

export interface MarkOpenedCommand {
  opened_date?: string;
}

// Shopping Lists
export type CreateShoppingListCommand = Pick<ShoppingLists, "name">;

export type UpdateShoppingListCommand = Pick<ShoppingLists, "name">;

export interface ShoppingListDto extends ShoppingLists {
  items?: ShoppingListItemDto[];
  item_count?: number;
}

export interface ShoppingListItemDto extends ShoppingListItems {
  product?: ProductDto;
}

export interface CreateShoppingListItemCommand {
  product_id: number;
  status?: "to_buy" | "bought";
}

export interface UpdateShoppingListItemCommand {
  status: "to_buy" | "bought";
}

// Reports
export type CreateReportCommand = Pick<Reports, "start_date" | "unit" | "length">;

export interface ReportDto extends Reports {
  details?: {
    products?: {
      id: number;
      name: string;
      brand?: string;
      spoiled_date: string;
      quantity: number;
      unit: string;
    }[];
  };
}

// Images
export type ImageDto = Images & {
  signed_url?: string;
};

export interface UploadImageCommand {
  file: File | Blob;
  type: "expiry" | "product";
}

export interface UploadImageResponse {
  id: number;
  product_id: number;
  bucket_name: string;
  file_path: string;
  type: "expiry" | "product";
  uploaded_at: string;
  signed_url: string;
}

export interface SignedUrlDto {
  id: number;
  product_id: number;
  type: "expiry" | "product";
  signed_url: string;
  expires_in: number;
  expires_at: string;
}

// Scans
export interface LogBarcodeScanCommand {
  barcode: string;
  source?: string;
}

// [PRZEZNACZONE DO PRZYSZŁEJ WERSJI] OCR functionality
export interface LogOcrCommand {
  confidence: number;
  detected_date?: string | null;
  source?: string;
}

export interface ScanLogDto {
  logged: boolean;
  rate_limit_remaining: number;
  rate_limit_reset_at: string;
}

// Analytics
export interface TrackEventCommand {
  event_type: string;
  data?: object;
}

export interface AnalyticsSummaryDto {
  household_id: number;
  period: string;
  start_date: string;
  end_date: string;
  events: Record<string, number>;
}

// Households
export interface HouseholdDto extends Households {
  members_count?: number;
  product_count?: number;
}

export interface UpdateHouseholdCommand {
  name?: string;
  timezone?: string;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next?: boolean;
  has_prev?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// API Response Types
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
}

export interface MarkSpoiledResponse {
  id: number;
  household_id: number;
  name: string;
  status: "spoiled";
  removed: boolean;
  event_recorded: boolean;
}

export interface MarkOpenedResponse {
  id: number;
  household_id: number;
  name: string;
  opened: boolean;
  opened_date: string;
}

export interface TrackEventResponse {
  event_id: number;
  event_type: string;
  household_id: number;
  timestamp: string;
  recorded: boolean;
}

export interface ShoppingListSummaryDto {
  id: number;
  household_id: number;
  name: string;
  created_at: string;
  item_count: number;
}

// Auth-related types for UI components
export interface UserHeaderProps {
  userEmail: string;
  householdName?: string;
}

export interface UserMenuProps {
  userEmail: string;
  householdName?: string;
}

// Extended registration input with household
export interface RegisterWithHouseholdInput {
  email: string;
  password: string;
  confirmPassword: string;
  householdName: string;
}

// Command for registering user with household creation
export interface RegisterWithHouseholdCommand {
  email: string;
  password: string;
  householdName: string;
}

// DTO returning user data with household information
export interface UserWithHouseholdDto {
  id: string;
  email: string;
  household: {
    id: number;
    name: string;
  };
}
