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
import { toast } from "sonner"; // Or "react-hot-toast" / your preferred toast library
import { useAuthStore } from "../store/auth-store";
import { getWsClient } from "./ws-client";

const GRAPHQL_HTTP_URL =
    process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:9000/graphql";

const httpLink = new HttpLink({ uri: GRAPHQL_HTTP_URL });

// Attaches the access token to every HTTP request
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

// Flag to prevent toast duplication if multiple GraphQL requests fail simultaneously
let isLoggingOut = false;

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        if (!isLoggingOut) {
          isLoggingOut = true;

          // 1. Show immediate toast
          toast.error("Your session has expired. Please log in again.", {
            id: "session-expired-toast",
          });

          // 2. Set persistent state for page reloads/redirects
          sessionStorage.setItem("session_expired_notice", "true");

          // 3. Clear auth store and reset state
          useAuthStore.getState().logout();

          // 4. Redirect to login page cleanly
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }

          setTimeout(() => {
            isLoggingOut = false;
          }, 3000);
        }
        break;
      }
    }
  } else {
    // eslint-disable-next-line no-console
    console.error("[Network error]", error);
  }
});

const httpChain = from([errorLink, authLink, httpLink]);

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