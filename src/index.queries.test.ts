import { describe, expect } from "vitest";
import { it } from "@effect/vitest";
import {
  makeQueryEffect,
  NetworkError,
  GraphQLError,
  makeReactiveQueryEffect,
  makeUrqlClientLayer,
} from "./index.ts";
import { cacheExchange, Client, fetchExchange, gql } from "@urql/core";
import { Effect, Stream } from "effect";
import { GetPokemonQuery } from "./generated/pokemon/graphql.ts";

describe("EffectfulUrql", () => {
  const clientLayer = makeUrqlClientLayer({
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
    const effect = makeQueryEffect<GetPokemonQuery>(query, {
      name: "pikachu",
    });

    return effect.pipe(
      Effect.tap((result) =>
        Effect.sync(() => {
          expect(result).toBeDefined();
          expect(result.pokemon?.name).toBe("Pikachu");
        })
      ),
      Effect.provide(clientLayer)
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
    const stream = makeReactiveQueryEffect<GetPokemonQuery>(query, {
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
      }),
      Effect.provide(clientLayer)
    );
  });
});

describe("Error handling", () => {
  const clientLayer = makeUrqlClientLayer({
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
    const effect = makeQueryEffect(query, {
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
      ),
      Effect.provide(clientLayer)
    );
  });

  it.effect(
    "should return a NetworkError when there is a network failure",
    () => {
      // Create a client pointing to an invalid/unreachable URL to simulate network failure
      const networkFailureClientLayer = makeUrqlClientLayer({
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
      const effect = makeQueryEffect(query, {
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
        ),
        Effect.provide(networkFailureClientLayer)
      );
    }
  );
});
