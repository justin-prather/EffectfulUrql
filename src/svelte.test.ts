import { describe, expect } from "vitest";
import { it } from "@effect/vitest";
import { makeQueryRune, makeMutationRune } from "./index.svelte.ts";
import { cacheExchange, Client, fetchExchange, gql } from "@urql/core";
import {
  GetPokemonQuery,
  GetPokemonQueryVariables,
  InsertPersonMutation,
  InsertPersonMutationVariables,
} from "./generated/local/graphql.ts";
import { InsertPersonMutation as InsertPerson } from "./queries/local/local-queries.ts";

describe("Svelte Runes", () => {
  let client = new Client({
    url: "https://graphql-pokemon2.vercel.app/",
    exchanges: [cacheExchange, fetchExchange],
  });

  it("should have the correct function signature and return structure", async () => {
    const query = gql`
      query GetPokemon($name: String!) {
        pokemon(name: $name) {
          name
        }
      }
    `;

    const rune = makeQueryRune<GetPokemonQuery, GetPokemonQueryVariables>(
      client,
      query,
      { name: "pikachu" }
    );
    console.log("rune", rune);
    expect(rune).toBeDefined();
    expect(rune.loading).toBe(true);
    expect(rune.error).toBe(null);
    expect(rune.data).toBe(null);
    expect(rune.stale).toBe(false);
    expect(rune.operationResult).toBe(null);

    // Wait for the query to complete using a promise-based approach
    await new Promise<void>((resolve) => {
      const checkLoading = () => {
        if (!rune.loading) {
          resolve();
        } else {
          // Use setTimeout to allow the event loop to process
          setTimeout(checkLoading, 10);
        }
      };
      checkLoading();
    });

    console.log("rune after completion", rune);
    console.log("loading:", rune.loading);
    console.log("data:", rune.data);
    console.log("operationResult:", rune.operationResult);
    expect(rune).toBeDefined();
    expect(rune.loading).toBe(false);
    expect(rune.error).toBe(null);
    expect(rune.data).toBeDefined();
    expect(rune.stale).toBe(false);
    expect(rune.operationResult).toBeDefined();

    rune.cleanup();
  });

  it("should have the correct function signature and return structure for makeMutationRune", async () => {
    // Use the local server for mutations
    const mutationClient = new Client({
      url: "http://localhost:4000/graphql",
      exchanges: [cacheExchange, fetchExchange],
    });

    const rune = makeMutationRune<
      InsertPersonMutation,
      InsertPersonMutationVariables
    >(mutationClient, InsertPerson, {
      input: {
        name: "Test Person",
        federations: {},
      },
    });

    console.log("mutation rune", rune);
    expect(rune).toBeDefined();
    expect(rune.loading).toBe(false); // Mutations start with loading = false
    expect(rune.error).toBe(null);
    expect(rune.data).toBe(null);
    expect(rune.operationResult).toBe(null);
    expect(typeof rune.execute).toBe("function");
    expect(typeof rune.cleanup).toBe("function");

    // Execute the mutation
    console.log("Executing mutation...");
    rune.execute();
    console.log("Mutation executed, loading:", rune.loading);

    // Wait for the mutation to complete using a promise-based approach
    await new Promise<void>((resolve) => {
      const checkLoading = () => {
        console.log("Checking loading state:", rune.loading);
        if (!rune.loading) {
          resolve();
        } else {
          // Use setTimeout to allow the event loop to process
          setTimeout(checkLoading, 10);
        }
      };
      checkLoading();
    });

    console.log("mutation rune after completion", rune);
    console.log("loading:", rune.loading);
    console.log("data:", rune.data);
    console.log("operationResult:", rune.operationResult);
    expect(rune).toBeDefined();
    expect(rune.loading).toBe(false);
    expect(rune.error).toBe(null);
    expect(rune.data).toBeDefined();
    expect(rune.operationResult).toBeDefined();
    expect(rune.data?.insertPerson?.name).toBe("Test Person");

    rune.cleanup();
  });
});
