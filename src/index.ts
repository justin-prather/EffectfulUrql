import {
  AnyVariables,
  Client,
  CombinedError,
  OperationResult,
  TypedDocumentNode,
} from "@urql/core";
import { Data, Effect } from "effect";

/**
 * Represents a network-level error that occurred during a GraphQL request.
 * This includes connection failures, timeouts, and other network-related issues.
 */
export class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string;
  readonly originalError?: Error;
  readonly response?: Response;
}> {}

/**
 * Represents one or more GraphQL errors returned by the server.
 * These are errors in the GraphQL response, not network or protocol errors.
 */
export class GraphQLError extends Data.TaggedError("GraphQLError")<{
  readonly message: string;
  readonly graphQLErrors: ReadonlyArray<{
    readonly message: string;
    readonly locations?: ReadonlyArray<{
      readonly line: number;
      readonly column: number;
    }>;
    readonly path?: ReadonlyArray<string | number>;
    readonly extensions?: Record<string, any>;
  }>;
}> {}

/**
 * Represents an error when the query result contains an error but no data.
 * This is a catch-all for errors that don't fit the other categories.
 */
export class QueryError extends Data.TaggedError("QueryError")<{
  readonly message: string;
  readonly combinedError: CombinedError;
}> {}

const mapErrors = <Data = any, Variables extends AnyVariables = AnyVariables>(
  result: OperationResult<Data, Variables>
) => {
  return Effect.gen(function* () {
    if (result.error) {
      const combinedError = result.error;

      // Check for network errors
      if (combinedError.networkError) {
        return yield* Effect.fail(
          new NetworkError({
            message:
              combinedError.networkError.message || "Network error occurred",
            originalError: combinedError.networkError,
            response: combinedError.response,
          })
        );
      }

      // Check for GraphQL errors
      if (
        combinedError.graphQLErrors &&
        combinedError.graphQLErrors.length > 0
      ) {
        const graphQLErrors = combinedError.graphQLErrors.map((err) => ({
          message: err.message,
          locations: err.locations,
          path: err.path,
          extensions: err.extensions,
        }));

        return yield* Effect.fail(
          new GraphQLError({
            message: combinedError.message,
            graphQLErrors,
          })
        );
      }

      // Fallback for other errors
      return yield* Effect.fail(
        new QueryError({
          message: combinedError.message,
          combinedError,
        })
      );
    }

    if (!result.data) {
      return yield* Effect.fail(
        new QueryError({
          message: "Query returned no data and no error",
          combinedError: new CombinedError({
            graphQLErrors: [],
            response: result.operation.context.response,
          }),
        })
      );
    }
    return result.data;
  });
};

/**
 * Creates an Effect that executes a GraphQL query using the provided urql client.
 *
 * @param client - The urql Client instance
 * @param query - The TypedDocumentNode representing the GraphQL query
 * @param variables - Optional variables for the query
 * @returns An Effect that yields the query result data or fails with a tagged error
 *
 * @example
 * ```ts
 * const client = new Client({ url: 'https://api.example.com/graphql' });
 * const query = gql`query { user { id name } }`;
 *
 * const effect = makeQueryEffect(client, query);
 * const result = await Effect.runPromise(effect);
 * ```
 *
 * Possible errors:
 * - NetworkError: Network-level failures (connection, timeout, etc.)
 * - GraphQLError: GraphQL errors returned by the server
 * - QueryError: Other query-related errors
 */
export const makeQueryEffect = <
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  client: Client,
  query: TypedDocumentNode<Data, Variables>,
  variables?: Variables
) => {
  return Effect.gen(function* () {
    const internalQuery = Effect.promise(() =>
      client.query(query, variables as Variables)
    );
    const result = yield* internalQuery;

    return result;
  }).pipe(
    Effect.flatMap(mapErrors),
    Effect.tap(() => Effect.log("Query Completed"))
  );
};

/**
 * Creates an Effect that executes a GraphQL mutation using the provided urql client.
 *
 * @param client - The urql Client instance
 * @param mutation - The TypedDocumentNode representing the GraphQL mutation
 * @param variables - Optional variables for the mutation
 * @returns An Effect that yields the mutation result data or fails with a tagged error
 *
 * @example
 * ```ts
 * const client = new Client({ url: 'https://api.example.com/graphql' });
 * const mutation = gql`mutation { createUser(name: "John") { id name } }`;
 *
 * const effect = makeMutationEffect(client, mutation);
 * const result = await Effect.runPromise(effect);
 * ```
 *
 * Possible errors:
 * - NetworkError: Network-level failures (connection, timeout, etc.)
 * - GraphQLError: GraphQL errors returned by the server
 * - QueryError: Other mutation-related errors
 */
export const makeMutationEffect = <
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  client: Client,
  mutation: TypedDocumentNode<Data, Variables>,
  variables?: Variables
) => {
  return Effect.gen(function* () {
    const internalMutation = Effect.promise(() =>
      client.mutation(mutation, variables as Variables)
    );
    const result = yield* internalMutation;

    return result;
  }).pipe(
    Effect.flatMap(mapErrors),
    Effect.tap(() => Effect.log("Mutation Completed"))
  );
};
