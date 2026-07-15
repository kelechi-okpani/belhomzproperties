"use client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { apolloClient } from "../lib/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <ApolloProvider client={apolloClient}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </ApolloProvider>
        </ThemeProvider>
    );
}