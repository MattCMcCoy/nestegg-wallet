import type { FetchQueryOptions } from "@tanstack/react-query";
import { cache } from "react";
import { headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { AppRouter } from "@nestegg/api";
import { appRouter, createTRPCContext } from "@nestegg/api";

import { auth } from "~/auth/server";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
    auth,
  });
});

const getQueryClient = cache(createQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

/**
 * Prefetch a tRPC query on the server.
 * This is a fire-and-forget operation; errors are handled silently.
 */
export function prefetch(queryOptions: {
  queryKey: readonly unknown[];
  queryFn?: unknown;
}) {
  const queryClient = getQueryClient();
  const queryKey = queryOptions.queryKey;
  // Check if this is an infinite query by examining the query key structure
  const secondKey: unknown =
    Array.isArray(queryKey) && queryKey.length > 1 ? queryKey[1] : null;
  const isInfiniteQuery =
    secondKey !== null &&
    typeof secondKey === "object" &&
    secondKey !== undefined &&
    "type" in secondKey &&
    typeof (secondKey as { type?: unknown }).type === "string" &&
    (secondKey as { type: string }).type === "infinite";

  if (isInfiniteQuery) {
    // For infinite queries, cast through unknown first to avoid type errors
    void queryClient.prefetchInfiniteQuery(
      queryOptions as unknown as Parameters<
        typeof queryClient.prefetchInfiniteQuery
      >[0],
    );
  } else {
    // For regular queries, cast to FetchQueryOptions
    void queryClient.prefetchQuery(
      queryOptions as unknown as FetchQueryOptions<unknown, unknown, unknown>,
    );
  }
}
