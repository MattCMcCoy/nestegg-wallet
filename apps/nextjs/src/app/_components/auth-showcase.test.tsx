import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Session } from "@nestegg/auth";

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
    const mockSession: Session = {
      session: {
        id: "session-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "123",
        expiresAt: new Date(),
        token: "token-123",
      },
      user: {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    vi.mocked(getSession).mockResolvedValue(mockSession);

    render(await AuthShowcase());
    expect(screen.getByText(/logged in as test user/i)).toBeInTheDocument();
  });
});
