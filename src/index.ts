import type {
  AnyVariables,
  ClientOptions,
  OperationResult,
  TypedDocumentNode,
} from "@urql/core";
import { Client, CombinedError } from "@urql/core";
import { Context, Data, Effect, Layer, Stream } from "effect";

interface UrqlClientServiceType {
  readonly client: Client;
}

export class UrqlClientService extends Context.Tag("UrqlClientService")<
  UrqlClientService,
  UrqlClientServiceType
>() {}

export const makeUrqlClientService = (
  config: ClientOptions | Client,
): UrqlClientServiceType => {
  let client;
  if (config instanceof Client) {
    client = config;
  } else {
    client = new Client(config);
  }

  return {
    client,
  };
};

export const makeUrqlClientLayer = (
  config: ClientOptions | Client,
): Layer.Layer<UrqlClientService> => {
  return Layer.succeed(UrqlClientService, makeUrqlClientService(config));
};

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
  result: OperationResult<Data, Variables>,
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
          }),
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
          }),
        );
      }

      // Fallback for other errors
      return yield* Effect.fail(
        new QueryError({
          message: combinedError.message,
          combinedError,
        }),
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
        }),
      );
    }
    return result;
  });
};

export const makeQueryEffect = <
  Data = any,
  Variables extends AnyVariables = AnyVariables,
>(
  query: TypedDocumentNode<Data, Variables>,
  variables?: Variables,
) => {
  return Effect.gen(function* () {
    const { client } = yield* UrqlClientService;
    const internalQuery = Effect.promise(() =>
      client.query(query, variables as Variables),
    );
    const result = yield* internalQuery;

    return result;
  }).pipe(
    Effect.flatMap(mapErrors),
    Effect.map((result) => result.data as NonNullable<typeof result.data>),
  );
};

export const makeReactiveQueryEffect = <
  Data = any,
  Variables extends AnyVariables = AnyVariables,
>(
  query: TypedDocumentNode<Data, Variables>,
  variables?: Variables,
) => {
  return Stream.unwrap(
    Effect.gen(function* () {
      const { client } = yield* UrqlClientService;
      return Stream.async<
        OperationResult<Data, Variables>,
        NetworkError | GraphQLError | QueryError
      >((emit) => {
        const internalQuery = client.query(query, variables as Variables);

        const subscription = internalQuery.subscribe((result) => {
          mapErrors(result).pipe(
            Effect.match({
              onFailure: (error) => emit.fail(error),
              onSuccess: (data) => emit.single(data),
            }),
            Effect.runPromise,
          );
        });

        // Return cleanup function that will be called when stream ends
        return Effect.sync(() => {
          console.log("unsubscribing from query");
          subscription.unsubscribe();
        });
      });
    }),
  );
};

export const makeMutationEffect = <
  Data = any,
  Variables extends AnyVariables = AnyVariables,
>(
  mutation: TypedDocumentNode<Data, Variables>,
  variables?: Variables,
) => {
  return Effect.gen(function* () {
    const { client } = yield* UrqlClientService;
    const internalMutation = Effect.promise(() =>
      client.mutation(mutation, variables as Variables),
    );
    const result = yield* internalMutation;

    return result;
  }).pipe(Effect.flatMap(mapErrors));
};

export const makeReactiveMutationEffect = <
  Data = any,
  Variables extends AnyVariables = AnyVariables,
>(
  mutation: TypedDocumentNode<Data, Variables>,
  variables?: Variables,
) => {
  return Stream.unwrap(
    Effect.gen(function* () {
      const { client } = yield* UrqlClientService;
      return Stream.async<
        OperationResult<Data, Variables>,
        NetworkError | GraphQLError | QueryError
      >((emit) => {
        const internalMutation = client.mutation(
          mutation,
          variables as Variables,
        );

        const subscription = internalMutation.subscribe((result) => {
          mapErrors(result).pipe(
            Effect.match({
              onFailure: (error) => emit.fail(error),
              onSuccess: (data) => emit.single(data),
            }),
            Effect.runPromise,
          );
        });

        // Return cleanup function that will be called when stream ends
        return Effect.sync(() => {
          console.log("unsubscribing from mutation");
          subscription.unsubscribe();
        });
      });
    }),
  );
};
