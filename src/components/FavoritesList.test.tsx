import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FavoritesList } from "./FavoritesList";

// Mock the products client service
vi.mock("@/lib/services/products-client.service", () => ({
  getRecentProducts: vi.fn(),
}));

import { getRecentProducts } from "@/lib/services/products-client.service";

const mockGetRecentProducts = vi.mocked(getRecentProducts);

describe("FavoritesList", () => {
  const mockOnSelectProduct = vi.fn();
  const mockProducts = [
    {
      id: 1,
      household_id: 1,
      name: "Milk",
      brand: "Dairy Farm",
      barcode: "123456789",
      quantity: 1,
      unit: "l",
      expiration_date: "2025-12-15",
      status: "active" as const,
      opened: false,
      to_buy: false,
      created_at: "2025-11-01T10:00:00Z",
      main_image_url: "https://example.com/milk.jpg",
    },
    {
      id: 2,
      household_id: 1,
      name: "Bread",
      brand: undefined,
      barcode: undefined,
      quantity: 2,
      unit: "pcs",
      expiration_date: "2025-11-10",
      status: "active" as const,
      opened: false,
      to_buy: true,
      created_at: "2025-11-02T10:00:00Z",
      main_image_url: undefined,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRecentProducts.mockResolvedValue(mockProducts);

    // FavoritesList first checks connectivity via a HEAD request.
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200 } as unknown as Response) as unknown as typeof fetch;
  });

  afterEach(() => {
    // Ensure fake timers from any test don't leak and break Testing Library polling.
    vi.useRealTimers();
  });

  it("does not render when isVisible is false", () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={false} />);

    expect(screen.queryByText("Quick Select from Recent Products")).not.toBeInTheDocument();
  });

  it("loads and displays recent products when visible", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    expect(screen.getByText("Loading recent products...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
      expect(screen.getByText("Bread")).toBeInTheDocument();
    });

    expect(mockGetRecentProducts).toHaveBeenCalledWith(10);
  });

  it("displays product information correctly", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    expect(screen.getByText("Dairy Farm")).toBeInTheDocument();
    expect(screen.getByText("1 l")).toBeInTheDocument();

    const expectedDate = new Date(mockProducts[0].expiration_date).toLocaleDateString();
    expect(screen.getByText(`Expires: ${expectedDate}`)).toBeInTheDocument();

    const milkTitle = screen.getByText("Milk");
    const milkCard = milkTitle.closest('[data-slot="card"]');
    expect(milkCard).toBeTruthy();
    expect(within(milkCard as HTMLElement).getByText("active")).toBeInTheDocument();
  });

  it("shows product image when available", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    const image = screen.getByAltText("Milk");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/milk.jpg");
  });

  it("handles products without brand or image", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Bread")).toBeInTheDocument();
    });

    const breadTitle = screen.getByText("Bread");
    const breadCard = breadTitle.closest('[data-slot="card"]');
    expect(breadCard).toBeTruthy();

    const breadScope = within(breadCard as HTMLElement);
    expect(breadScope.queryByText("Dairy Farm")).not.toBeInTheDocument();
    expect(breadScope.queryByRole("img", { name: "Bread" })).not.toBeInTheDocument();
  });

  it("calls onSelectProduct when product is clicked", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Milk"));

    expect(mockOnSelectProduct).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("displays error message when loading fails", async () => {
    const errorMessage = "Failed to load recent products";
    mockGetRecentProducts.mockRejectedValue(new Error(errorMessage));

    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
  });

  it("retries loading when try again button is clicked", async () => {
    const errorMessage = "Network error";
    mockGetRecentProducts.mockRejectedValueOnce(new Error(errorMessage));
    mockGetRecentProducts.mockResolvedValueOnce(mockProducts);

    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    // Wait with real timers (Testing Library polling relies on timers).
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });

    // Switch to fake timers only for the backoff delay.
    vi.useFakeTimers();
    fireEvent.click(tryAgainButton);

    // Retry uses exponential backoff: first retry happens after 1s.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Switch back so Testing Library polling works normally.
    vi.useRealTimers();

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    expect(mockGetRecentProducts).toHaveBeenCalledTimes(2);
  });

  it("dismisses error when dismiss button is clicked", async () => {
    const errorMessage = "Failed to load recent products";
    mockGetRecentProducts.mockRejectedValue(new Error(errorMessage));

    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole("button", { name: /dismiss/i });
    fireEvent.click(dismissButton);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("shows empty state when no products found", async () => {
    mockGetRecentProducts.mockResolvedValue([]);

    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("No recent products found")).toBeInTheDocument();
    });

    expect(screen.getByText("Add some products first to see them here")).toBeInTheDocument();
  });

  it("shows refresh button when products are loaded", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole("button", { name: /refresh list/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it("refreshes products when refresh button is clicked", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole("button", { name: /refresh list/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockGetRecentProducts).toHaveBeenCalledTimes(2);
    });
  });

  it("formats dates correctly", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    const expectedDate = new Date(mockProducts[0].expiration_date).toLocaleDateString();

    await waitFor(() => {
      expect(screen.getByText(`Expires: ${expectedDate}`)).toBeInTheDocument();
    });
  });

  it("applies correct status badge colors", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      const activeBadges = screen.getAllByText("active");
      expect(activeBadges[0]).toHaveClass("bg-green-100", "text-green-800");
    });
  });
});
