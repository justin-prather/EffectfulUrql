import { describe, expect, beforeEach } from "vitest";
import { it } from "@effect/vitest";
import {
  makeQueryEffect,
  NetworkError,
  GraphQLError,
  makeReactiveQueryEffect,
  // QueryError,
  makeMutationEffect,
  makeReactiveMutationEffect,
} from "./index.ts";
import { cacheExchange, Client, fetchExchange, gql } from "@urql/core";
import { Effect, Layer, Logger, LogLevel, Stream } from "effect";
import {
  InsertPersonMutation,
  InsertPersonMutationVariables,
  ReadPeopleQuery,
} from "./generated/local/graphql.ts";
import {
  ReadPeopleQuery as ReadPeople,
  InsertPersonMutation as InsertPerson,
} from "./queries/local/local-queries.ts";
import { GetPokemonQuery } from "./generated/pokemon/graphql.ts";

describe("EffectfulUrql", () => {
  let client = new Client({
    url: "https://graphql-pokemon2.vercel.app/",
    exchanges: [cacheExchange, fetchExchange],
  });

  it.effect("should make a query effect and return data", () => {
    const query = gql`
      query GetPokemon($name: String!) {
        pokemon(name: $name) {
          name
        }
      }
    `;
    const effect = makeQueryEffect<GetPokemonQuery>(client, query, {
      name: "pikachu",
    });

    return effect.pipe(
      Effect.tap((result) =>
        Effect.sync(() => {
          expect(result).toBeDefined();
          expect(result.pokemon?.name).toBe("Pikachu");
        })
      )
    );
  });

  it.effect("should make a reactive query effect and return data", () => {
    const query = gql`
      query GetPokemon($name: String!) {
        pokemon(name: $name) {
          name
          number
          image
          classification
          types
        }
      }
    `;
    const stream = makeReactiveQueryEffect<GetPokemonQuery>(client, query, {
      name: "pikachu",
    });

    // Take the first emitted value from the stream
    return stream.pipe(
      Stream.take(1),
      Stream.runHead,
      Effect.flatMap((result) => {
        if (result._tag === "None") {
          return Effect.fail(new Error("No result received"));
        }
        console.log("result", result.value);
        expect(result.value).toBeDefined();
        expect(result.value.data?.pokemon?.name).toBe("Pikachu");
        return Effect.succeed(result.value);
      })
    );
  });

  it.live("should make a reactive mutation effect and return data", () => {
    // Use the local server for mutations
    const mutationClient = new Client({
      url: "http://localhost:4000/graphql",
      exchanges: [cacheExchange, fetchExchange],
    });

    const stream = makeReactiveMutationEffect<
      InsertPersonMutation,
      InsertPersonMutationVariables
    >(mutationClient, InsertPerson, {
      input: {
        name: "Test Person",
        federations: {},
      },
    });

    // Take the first emitted value from the stream
    return stream.pipe(
      Stream.take(1),
      Stream.runHead,
      Effect.flatMap((result) => {
        if (result._tag === "None") {
          return Effect.fail(new Error("No result received"));
        }
        console.log("mutation result", result.value);
        expect(result.value).toBeDefined();
        expect(result.value.data?.insertPerson?.name).toBe("Test Person");
        return Effect.succeed(result.value);
      })
    );
  });
});

describe("Error handling", () => {
  let client = new Client({
    url: "https://graphql-pokemon2.vercel.app/",
    exchanges: [cacheExchange, fetchExchange],
  });

  it.effect("should return a GraphQLError when the query is invalid", () => {
    const query = gql`
      query BadGraphQLQuery($name: String!) {
        pokemon(name: $name) {
          invalidFieldThatDoesNotExist
        }
      }
    `;
    const effect = makeQueryEffect(client, query, {
      name: "pikachu",
    });

    return Effect.gen(function* () {
      const data = yield* effect;
      return data;
    }).pipe(
      Effect.catchTags({
        GraphQLError: (error) => Effect.succeed(error),
      }),
      Effect.tap((result) =>
        Effect.sync(() => {
          expect(result).toBeInstanceOf(GraphQLError);
        })
      )
    );
  });

  it.effect(
    "should return a NetworkError when there is a network failure",
    () => {
      // Create a client pointing to an invalid/unreachable URL to simulate network failure
      const networkFailureClient = new Client({
        url: "http://localhost:9999/graphql-will-fail",
        exchanges: [fetchExchange],
      });

      const query = gql`
        query BadNetworkQuery($name: String!) {
          pokemon(name: $name) {
            name
          }
        }
      `;
      const effect = makeQueryEffect(networkFailureClient, query, {
        name: "pikachu",
      });

      return Effect.gen(function* () {
        const data = yield* effect;
        return data;
      }).pipe(
        Effect.catchTags({
          NetworkError: (error) => Effect.succeed(error),
        }),
        Effect.tap((result) =>
          Effect.sync(() => {
            expect(result).toBeInstanceOf(NetworkError);
            expect(result.message).toBeDefined();
          })
        )
      );
    }
  );
});

describe("Mutation", () => {
  let client = new Client({
    url: "http://localhost:4000/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

  it.live("should make a mutation effect and return data", () => {
    const reactiveEffect = makeReactiveQueryEffect<ReadPeopleQuery>(
      client,
      ReadPeople
    );

    const effect = makeMutationEffect<
      InsertPersonMutation,
      InsertPersonMutationVariables
    >(client, InsertPerson, {
      input: {
        name: "John Doe",
        federations: {},
      },
    });

    return Effect.gen(function* () {
      // Track the initial count
      let initialCount: number | undefined;
      let finalCount: number | undefined;

      // Fork the reactive effect to run in parallel
      const streamFiber = yield* Effect.fork(
        reactiveEffect.pipe(
          Stream.runForEach((result) =>
            Effect.sync(() => {
              const count = result.data?.people?.length;
              console.log(
                "Num People:",
                count,
                "hasNext:",
                result.hasNext,
                "stale:",
                result.stale
              );

              // Capture the initial count (first non-stale result)
              if (initialCount === undefined && !result.stale) {
                initialCount = count;
              }

              // Capture the final count (last non-stale result)
              if (!result.stale) {
                finalCount = count;
              }
            })
          )
        )
      );

      // Wait a bit for the first result
      yield* Effect.sleep("100 millis");

      // Run the mutation
      const mutationResult = yield* effect;

      // Give some time for the cache update to propagate
      yield* Effect.sleep("500 millis");

      // Verify the count increased by 1
      if (initialCount !== undefined && finalCount !== undefined) {
        expect(finalCount).toBe(initialCount + 1);
        console.log(
          `✅ Count increased from ${initialCount} to ${finalCount} (+1)`
        );
      } else {
        throw new Error("Failed to capture initial or final count");
      }

      return mutationResult;
    }).pipe(
      Effect.withLogSpan("insertPerson"),
      Effect.tap((result) =>
        Effect.sync(() => {
          expect(result).toBeDefined();
          expect(result.data?.insertPerson?.name).toBe("John Doe");
        })
      ),
      Effect.provide(
        Layer.merge(Logger.pretty, Logger.minimumLogLevel(LogLevel.All))
      )
    );
  });
});
