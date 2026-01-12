import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthShowcase } from "./auth-showcase";

// Mock the auth module
vi.mock("~/auth/server", () => ({
  auth: {
    api: {
      signInSocial: vi.fn(),
      signOut: vi.fn(),
    },
  },
  getSession: vi.fn(),
}));

describe("AuthShowcase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show sign in button when not authenticated", async () => {
    const { getSession } = await import("~/auth/server");
    vi.mocked(getSession).mockResolvedValue(null);

    render(await AuthShowcase());
    expect(screen.getByText(/sign in with discord/i)).toBeInTheDocument();
  });

  it("should show user name when authenticated", async () => {
    const { getSession } = await import("~/auth/server");
    vi.mocked(getSession).mockResolvedValue({
      user: {
        name: "Test User",
        email: "test@example.com",
        id: "123",
      },
    } as any);

    render(await AuthShowcase());
    expect(screen.getByText(/logged in as test user/i)).toBeInTheDocument();
  });
});
