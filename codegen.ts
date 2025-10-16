import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql-pokemon2.vercel.app/",
  // schema: "http://localhost:4000/graphql",
  documents: "./src/**/*.{graphql,ts}",

  generates: {
    "src/generated/": {
      preset: "client",
      config: {
        useTypeImports: true,
        // enumAsTypes: true,
      },
    },
  },
};

export default config;
