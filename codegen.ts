import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    documents: ["src/**/*.{ts,tsx,graphql}"],
    generates: {
        "./src/graphql/generated/": {
            preset: "client",
        },
        "./src/graphql/schema.graphql": {
            plugins: ["schema-ast"],
        },
    },
};

export default config;