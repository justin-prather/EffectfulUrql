import { describe, expect, beforeEach } from "vitest";
import { it } from "@effect/vitest";
import {
  makeQueryEffect,
  NetworkError,
  GraphQLError,
  // QueryError,
  // makeMutationEffect,
} from "./index.ts";
import { cacheExchange, Client, fetchExchange, gql } from "@urql/core";
import { Effect } from "effect";
import {
  BadGraphQlQueryQuery,
  GetPokemonQuery,
  // InsertPersonMutation,
  // InsertPersonMutationVariables,
} from "./generated/graphql.ts";

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
    const effect = makeQueryEffect<BadGraphQlQueryQuery>(client, query, {
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

// describe("Mutation", () => {
//   let client = new Client({
//     url: "http://localhost:4000/graphql",
//     exchanges: [cacheExchange, fetchExchange],
//   });

//   it.live("should make a mutation effect and return data", () => {
//     const InsertPerson = gql`
//       mutation InsertPerson($input: CreatePersonInput!) {
//         insertPerson(input: $input) {
//           id
//           name
//         }
//       }
//     `;
//     const effect = makeMutationEffect<
//       InsertPersonMutation,
//       InsertPersonMutationVariables
//     >(client, InsertPerson, {
//       input: {
//         name: "John Doe",
//         federations: {},
//       },
//     });

//     return effect.pipe(
//       Effect.withLogSpan("insertPerson"),
//       Effect.tap((result) =>
//         Effect.sync(() => {
//           expect(result).toBeDefined();
//           expect(result.insertPerson?.name).toBe("John Doe");
//         })
//       ),
//       Effect.provide(
//         Layer.merge(Logger.pretty, Logger.minimumLogLevel(LogLevel.All))
//       )
//     );
//   });
// });
