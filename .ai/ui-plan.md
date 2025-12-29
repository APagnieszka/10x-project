# UI Architecture for Foodzilla

## 1. UI Structure Overview

Foodzilla is a Progressive Web App (PWA) designed for households to manage food inventory and reduce food waste. The UI architecture is based on a mobile-first approach with bottom tab navigation, a floating action button for adding products, and full camera integration for barcode scanning and expiration date recognition. The interface uses Shadcn/ui components for consistent design, React Query for server state management, and local storage for offline functionality. All views are fully accessible according to WCAG 2.1 AA standards, with multi-language support (Polish/English) and secure integration with Supabase API.

## 2. List of Views

### Authentication View
- **View Path:** `/auth`
- **Main Purpose:** Allow users to log in or register a shared household account
- **Key Information to Display:** Login/registration form, password reset link, privacy policy information
- **Key View Components:** Form with email/password fields, buttons to switch between login/registration, toast with verification email sent message
- **UX, Accessibility and Security Considerations:** Real-time validation, error messages in user's language, keyboard support, password hiding, secure data transmission

### Product Inventory List
- **View Path:** `/`
- **Main Purpose:** Display all active products in the household with filtering and search capabilities
- **Key Information to Display:** List of products in cards with name, brand, expiration date, status (opened/spoiled), quantity, main image
- **Key View Components:** Search bar, filter chips (status, category), product card list with status badges, floating add button
- **UX, Accessibility and Security Considerations:** Swipe actions for quick operations, infinite scrolling, ARIA labels for screen readers, household data protection

### Add Product Form
- **View Path:** `/products/add`
- **Main Purpose:** Add a new product to inventory through barcode scanning, expiration date OCR, or manual entry
- **Key Information to Display:** Form with name/brand/quantity/unit/expiration date fields, buttons for barcode scanning and taking photos
- **Key View Components:** Full-screen camera overlay for scanning, OCR confirmation modal with confidence slider, favorite products list for quick selection
- **UX, Accessibility and Security Considerations:** Camera overlay with tips (sharp focus, good lighting), field validation, touch gesture support, secure camera access

### Product Details/Edit
- **View Path:** `/products/{id}`
- **Main Purpose:** Display full product details and enable editing or performing actions (open, mark as spoiled, move to shopping list)
- **Key Information to Display:** All product data, change history, action buttons, product image with signed URL
- **Key View Components:** Product card with full details, action menu (dropdown), status toggle buttons, destructive action confirmation modal
- **UX, Accessibility and Security Considerations:** Lazy image loading, concurrent edit conflict handling, ARIA landmarks for keyboard navigation

### Shopping List
- **View Path:** `/shopping`
- **Main Purpose:** Manage shopping list with ability to mark items as purchased
- **Key Information to Display:** List of products to buy with quantities and units, mark as purchased buttons
- **Key View Components:** List with checkboxes, quick action buttons, product counter, ability to create named shopping lists
- **UX, Accessibility and Security Considerations:** Drag to reorder, action confirmation toasts, cross-device synchronization

### Draft Products
- **View Path:** `/products/draft`
- **Main Purpose:** Complete details of purchased products before adding to inventory
- **Key Information to Display:** List of products with incomplete data, forms to fill expiration dates and quantities
- **Key View Components:** Draft card list with "complete details" buttons, edit modal, completion progress
- **UX, Accessibility and Security Considerations:** Auto-saving, data validation, ability to delete draft without saving

### Reports Dashboard
- **View Path:** `/reports`
- **Main Purpose:** Display historical food waste reports and generate new ones
- **Key Information to Display:** List of weekly reports, monthly/yearly summaries, trend charts
- **Key View Components:** Report cards with dates and numbers, buttons to generate new reports, time filters
- **UX, Accessibility and Security Considerations:** On-demand loading, offline cache, alternative descriptions for charts

### Settings
- **View Path:** `/settings`
- **Main Purpose:** Configure app preferences and account management
- **Key Information to Display:** Language toggles, notifications, analytics switches, household account information
- **Key View Components:** Grouped settings list, action buttons (logout, delete account), app version information
- **UX, Accessibility and Security Considerations:** Destructive action confirmations, secure token management, privacy policy information

## 3. User Journey Map

### Main Use Case Scenario: Adding First Product
1. **App Launch** → Authentication view (if not logged in)
2. **Login/Registration** → Automatic redirect to inventory list
3. **Inventory List (empty)** → Encouraging message to add first product
4. **Floating Button Press** → Navigate to add product form
5. **Barcode Scanning** → Camera overlay, code detection, data fetch from Open Food Facts
6. **Expiration Date Photo** → Camera overlay, OCR with confirmation
7. **Form Completion** → Validation and product save
8. **Return to Inventory List** → Display new product with animation

### Scenario: Managing Product Near Expiration
1. **Push Notification Received** → Deep link to inventory list with "near expiration" filter
2. **Product Selection from List** → Product details view
3. **Mark as Consumed** → Confirmation modal, removal from inventory
4. **Move to Shopping List** → Add to shopping list with auto-fill

### Scenario: Shopping and Inventory Replenishment
1. **Navigate to Shopping List** → Display products to buy
2. **Mark Products as Purchased** → Move to draft for completion
3. **Complete Details in Draft** → Add expiration dates, quantities, photos
4. **Add to Inventory** → Navigate to inventory list with new product

### Scenario: Reviewing Waste Reports
1. **Navigate to Reports Panel** → List of historical weekly reports
2. **Report Selection** → Detailed view with spoiled products list
3. **Generate Monthly Report** → Asynchronous creation, readiness notification

## 4. Layout and Navigation Structure

### Main Navigation
- **Bottom Tabs:** Four main sections (Inventory, Shopping List, Reports, Settings) with icons and labels
- **Floating Button:** Always visible in bottom right corner for quick access to product adding
- **Deep Linking:** Support for links from push notifications to specific products or filters

### Secondary Navigation
- **Header with Title:** With contextual action buttons (search, filters, menu)
- **Breadcrumbs:** In nested views for better orientation
- **Modal Overlays:** For forms, confirmations, and camera overlays

### Responsiveness
- **Mobile-first:** Optimization for touch screens 320px+
- **Tablet:** Layout adaptation for larger screens with side panel
- **Desktop:** Maximum container width, content centering

## 5. Key Components

### Shared Components
- **ProductCard:** Product card with image, name, expiration date, and status badges
- **StatusBadge:** Colored badges for statuses (active, opened, spoiled, draft)
- **FilterChips:** Filter chips with multi-select capability
- **SearchBar:** Search bar with debounce and suggestions
- **CameraOverlay:** Full-screen camera overlay with controls and tips
- **Toast:** Toast notifications with different types (success, error, warning)
- **LoadingSpinner:** Loading indicators with different sizes
- **ErrorBoundary:** Error handling with retry buttons
- **OfflineIndicator:** Connection status indicator with sync capability

### Specific Components
- **OCRConfidenceSlider:** Slider for confirming OCR results with confidence level
- **SwipeActions:** Swipe actions for quick operations on cards
- **ReportChart:** Simple charts for waste trend visualization
- **LanguageSwitcher:** Language switcher with immediate application
- **NotificationSettings:** Detailed push and email notification settings