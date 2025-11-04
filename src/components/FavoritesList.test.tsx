import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
    expect(screen.getByText("Expires: 12/15/2025")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
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

    expect(screen.queryByText("Dairy Farm")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Bread")).not.toBeInTheDocument();
  });

  it("calls onSelectProduct when product is clicked", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    const milkCard = screen.getByText("Milk").closest("div");
    if (milkCard) {
      fireEvent.click(milkCard);
    }

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

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(tryAgainButton);

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

    expect(mockGetRecentProducts).toHaveBeenCalledTimes(2);
  });

  it("formats dates correctly", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      expect(screen.getByText("Expires: 12/15/2025")).toBeInTheDocument();
    });
  });

  it("applies correct status badge colors", async () => {
    render(<FavoritesList onSelectProduct={mockOnSelectProduct} isVisible={true} />);

    await waitFor(() => {
      const activeBadge = screen.getByText("active");
      expect(activeBadge).toHaveClass("bg-green-100", "text-green-800");
    });
  });
});
