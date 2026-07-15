module.exports = {
    client: {
        service: {
            name: "belhomz-api",
            url: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        },
        includes: ["src/**/*.{ts,tsx,graphql,gql}"],
        tagName: "gql",
    },
};