import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { APIContext } from "astro";

// Mock environment variables
vi.stubEnv("PUBLIC_SUPABASE_URL", "http://localhost:54321");
vi.stubEnv("PUBLIC_SUPABASE_KEY", "test-anon-key");

// Mock the Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

// Mock the products service
const mockGetHouseholdIdPublic = vi.fn();
vi.mock("@/lib/services/products.service", () => ({
  ProductsService: vi.fn().mockImplementation(() => ({
    getHouseholdIdPublic: mockGetHouseholdIdPublic,
  })),
}));

// Mock logger
vi.mock("@/lib/logger", () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    addContext: vi.fn(),
  })),
}));

import { GET } from "./products";

describe("GET /api/products - Empty List Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return empty list when user has no household", async () => {
    // Setup mocks
    const mockUserId = "test-user-id";
    const mockToken = "test-token";

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    });

    // Mock ProductsService to throw error (user not in household)
    mockGetHouseholdIdPublic.mockRejectedValue(new Error("User is not a member of any household"));

    // Create mock context
    const mockContext = {
      request: new Request("http://localhost:4321/api/products?limit=10", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }),
      locals: {
        supabase: mockSupabaseClient,
      },
      url: new URL("http://localhost:4321/api/products?limit=10"),
    } as unknown as APIContext;

    // Execute
    const response = await GET(mockContext);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: [],
      pagination: {
        limit: 10,
        total: 0,
      },
    });
  });

  it("should return empty list when household has no products", async () => {
    // Setup mocks
    const mockUserId = "test-user-id";
    const mockToken = "test-token";
    const mockHouseholdId = 1;

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    });

    // Mock ProductsService to return household ID
    mockGetHouseholdIdPublic.mockResolvedValue(mockHouseholdId);

    // Mock Supabase query to return empty array
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });

    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      order: mockOrder,
      limit: mockLimit,
    });

    // Create mock context
    const mockContext = {
      request: new Request("http://localhost:4321/api/products?limit=10", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }),
      locals: {
        supabase: mockSupabaseClient,
      },
      url: new URL("http://localhost:4321/api/products?limit=10"),
    } as unknown as APIContext;

    // Execute
    const response = await GET(mockContext);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: [],
      pagination: {
        limit: 10,
        total: 0,
      },
    });
  });
});
