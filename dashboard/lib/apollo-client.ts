import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  split,
  ApolloLink,
  CombinedGraphQLErrors,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { useAuthStore } from "../store/auth-store";

import { getWsClient } from "./ws-client";

const GRAPHQL_HTTP_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL ?? "http://localhost:9000/graphql";

const httpLink = new HttpLink({ uri: GRAPHQL_HTTP_URL });

// Attaches the access token to every HTTP request from the auth store.
const authLink = new ApolloLink((operation, forward) => {
  const token = useAuthStore.getState().accessToken;
  operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));
  return forward(operation);
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        useAuthStore.getState().logout();
      }
    }
  } else {
    // eslint-disable-next-line no-console
    console.error("[Network error]", error);
  }
});

const httpChain = from([errorLink, authLink, httpLink]);

// Subscriptions only ever run in the browser — guard against SSR trying
// to open a WebSocket during the Next.js build/server render.
const wsLink =
  typeof window !== "undefined" ? new GraphQLWsLink(getWsClient()) : null;

const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpChain
      )
    : httpChain;

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
