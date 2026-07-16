"use client";

import { createClient, Client } from "graphql-ws";
import { useAuthStore } from "../store/auth-store";

const GRAPHQL_WS_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "ws://localhost:9000/graphql";

let client: Client | null = null;

/**
 * Lazily creates a single shared graphql-ws client. Auth is passed via
 * connectionParams (there's no HTTP header on a WebSocket connection),
 * matching the backend's `buildWsContext`.
 */
export function getWsClient(): Client {
  if (!client) {
    client = createClient({
      url: GRAPHQL_WS_URL,
      connectionParams: () => {
        const token = useAuthStore.getState().accessToken;
        return token ? { authorization: `Bearer ${token}` } : {};
      },
      shouldRetry: () => true,
      retryAttempts: Infinity,
    });
  }
  return client;
}
