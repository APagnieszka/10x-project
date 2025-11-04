# Add Product View Implementation Plan

## 1. Overview
The add product view allows users to add a new product to the household inventory through barcode scanning, expiration date OCR recognition, or manual data entry. The view contains a form with fields such as name, brand, quantity, unit, expiration date, and buttons for barcode scanning and taking photos. The main goal is to facilitate quick and accurate product addition to reduce food waste.

## 2. View Routing
The view will be available at the path `/products/add`.

## 3. Component Structure
- **AddProductPage**: Main page component containing the form and action buttons
  - **ProductForm**: Form with fields for entering product data
  - **BarcodeScanner**: Camera overlay for barcode scanning
  - **OcrScanner**: Camera overlay for taking expiration date photos with OCR
  - **OcrConfirmationModal**: Modal for confirming OCR results
  - **FavoritesList**: List of favorite products for quick selection

## 4. Component Details
### AddProductPage
- Component description: Main page component responsible for coordinating all subcomponents and managing view state
- Main elements: Container with form, action buttons (scan code, take photo), favorites list
- Supported interactions: Clicking scan buttons, form submission, selecting product from favorites
- Supported validation: Validation of all form fields according to API schema (required fields, date formats, value ranges)
- Types: CreateProductCommand for form data, ProductDto for API response
- Props: None (page component)

### ProductForm
- Component description: Form for entering product data with real-time validation
- Main elements: Input fields for name, brand, barcode, quantity, unit, expiration date, checkbox for opened status
- Supported interactions: Text input, dropdown selection, form submission
- Supported validation: Required fields (name, quantity, unit, expiration date), YYYY-MM-DD date format, positive quantity, valid unit from allowed list
- Types: CreateProductCommand
- Props: onSubmit (function handling submission), initialData (optional initial data)

### BarcodeScanner
- Component description: Camera overlay using QuaggaJS for barcode detection and decoding
- Main elements: Full-screen camera preview, camera switch buttons, user tips
- Supported interactions: Camera launch, code detection, scan cancellation
- Supported validation: None (only valid barcode detection)
- Types: No specific types
- Props: onBarcodeDetected (callback with detected code), onCancel (cancellation callback)

### OcrScanner
- Component description: Camera overlay for taking photos of expiration date labels using Tesseract.js
- Main elements: Camera preview, photo capture button, tips (sharp focus, good lighting)
- Supported interactions: Camera launch, photo capture, cancellation
- Supported validation: None (only photo capture)
- Types: No specific types
- Props: onPhotoTaken (callback with image), onCancel (cancellation callback)

### OcrConfirmationModal
- Component description: Modal for confirming OCR recognition results with confidence slider
- Main elements: Displayed photo, recognized text, confidence slider, confirm/reject buttons
- Supported interactions: Confidence slider movement, date confirmation/rejection
- Supported validation: Confidence >= 90% auto-approves, < 90% requires manual correction
- Types: OcrResult with confidence and detectedDate fields
- Props: ocrResult (OCR results), onConfirm (callback with confirmed date), onReject (rejection callback)

### FavoritesList
- Component description: List of recently added products for quick selection instead of re-scanning
- Main elements: List of product cards with name, brand, and image
- Supported interactions: Product selection from list
- Supported validation: None
- Types: ProductDto[]
- Props: products (product list), onSelect (selection callback)

## 5. Types
```typescript
// DTO for creating product
export type CreateProductCommand = {
  name: string;
  brand?: string;
  barcode?: string;
  quantity: number;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pcs';
  expiration_date: string; // YYYY-MM-DD
  status?: 'draft' | 'active' | 'spoiled';
  opened?: boolean;
  to_buy?: boolean;
  opened_date?: string;
  main_image_url?: string;
};

// API response DTO
export interface ProductDto {
  id: number;
  household_id: number;
  name: string;
  brand?: string;
  barcode?: string;
  quantity: number;
  unit: string;
  expiration_date: string;
  status: 'draft' | 'active' | 'spoiled';
  opened: boolean;
  to_buy: boolean;
  opened_date?: string;
  created_at: string;
  main_image_url?: string;
  images?: ImageDto[];
}

// ViewModel for form state
export interface ProductFormViewModel {
  data: CreateProductCommand;
  errors: Partial<Record<keyof CreateProductCommand, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ViewModel for OCR results
export interface OcrResult {
  confidence: number;
  detectedDate: string | null;
  imageData: string; // base64
}
```

## 6. State Management
View state will be managed using React hooks. The main AddProductPage component will use useState for coordination between subcomponents. A custom useProductForm hook will be created for complex form states, handling validation, field updates, and submission. Camera state will be managed by useCamera hook, and OCR by useOcrProcessor hook. All states will be local to the component, without need for global state management.

## 7. API Integration
The view integrates with the POST /api/products endpoint. The request requires an Authorization header with Bearer JWT token. Request body contains CreateProductCommand object. Response returns ProductDto with created product. The endpoint handles rate limiting (20 requests/min per household), data validation, and authorization. In case of errors, it returns structured responses with error codes (400, 401, 403, 409, 429, 500).

## 8. User Interactions
- User clicks "Scan barcode" button → camera overlay opens → code detection → automatic filling of name/brand fields from Open Food Facts API
- User clicks "Take date photo" button → camera overlay opens → photo taken → OCR processing → confirmation modal with confidence slider displayed
- User moves confidence slider and confirms date → date is entered into form
- User fills remaining fields manually or selects from favorites list
- User clicks "Add product" → form validation → API request sent → success or errors displayed

## 9. Conditions and Validation
- Product name: required, non-empty, maximum 255 characters
- Brand: optional, maximum 255 characters
- Barcode: optional, unique within household, text format
- Quantity: required, greater than 0, maximum 9999.99
- Unit: required, one of allowed values ('kg', 'g', 'l', 'ml', 'pcs')
- Expiration date: required, YYYY-MM-DD format, not earlier than today
- Status: optional, default 'active', one of values ('draft', 'active', 'spoiled')
- Opened: optional, boolean, default false
- Opened_date: required if opened=true, timestamp format
- Main_image_url: optional, valid URL

Conditions are verified at component level using Zod schema, and also on API side. Validation errors are displayed next to respective fields in real-time.

## 10. Error Handling
- Camera access error: Display message about granting permissions
- Barcode scanning failure: Message "Failed to scan code" with retry option
- Low photo quality for OCR: Improvement tips (sharp focus, better lighting)
- API error (401): Redirect to login
- API error (403): Message "No access to household"
- API error (409): Message "Product with this barcode already exists"
- API error (429): Message about limit exceeded with reset time
- Network error: Message "Check internet connection" with retry button
- Validation error: Highlight invalid fields with error descriptions

## 11. Implementation Steps
1. Create AddProductPage component with basic structure and routing
2. Implement ProductForm with fields and basic validation
3. Add integration with POST /api/products API
4. Implement BarcodeScanner with QuaggaJS
5. Add Open Food Facts API call for filling data from barcode
6. Implement OcrScanner with Tesseract.js
7. Create OcrConfirmationModal with confidence slider
8. Add FavoritesList with recently added products
9. Implement full error handling and messages
10. Add unit tests for components and integration tests for API
11. Test on mobile devices and browsers
12. Optimize loading performance and responsiveness</content>
<parameter name="filePath">/Users/agnieszka.podbielska/reposSSH/AI/10x-project/.ai/add-product-view-implementation-plan.md