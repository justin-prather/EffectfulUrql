import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql-pokemon2.vercel.app/",
  documents: "./src/queries/pokemon/**/*.{graphql,ts}",

  generates: {
    "src/generated/pokemon/": {
      preset: "client",
      config: {
        useTypeImports: true,
        // enumAsTypes: true,
      },
    },
    "src/generated/local/": {
      schema: "http://localhost:4000/graphql",
      documents: "./src/queries/local/**/*.{graphql,ts}",
      preset: "client",
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
