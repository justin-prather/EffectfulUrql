import { Stream, Effect, Fiber } from "effect/index";
import { makeReactiveQueryEffect, makeReactiveMutationEffect } from "./index";
import {
  AnyVariables,
  Client,
  OperationResult,
  TypedDocumentNode,
} from "@urql/core";

export const makeQueryRune = <
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  client: Client,
  query: TypedDocumentNode<Data, Variables>,
  variables?: Variables
) => {
  let loading = $state(true);
  let error = $state<Error | null>(null);
  let data = $state<Data | null>(null);
  let operationResult = $state<OperationResult<Data, Variables> | null>(null);
  let stale = $state(false);
  let fiber: Fiber.RuntimeFiber<any, any> | null = null;

  const stream = makeReactiveQueryEffect(client, query, variables);

  // Run the stream effect to update state
  const effect = stream.pipe(
    Stream.runForEach((result: OperationResult<Data, Variables>) => {
      operationResult = result;
      loading = false;
      error = result.error ? result.error : null;
      data = result.data ?? null;
      stale = result.stale;
      return Effect.void;
    }),
    Effect.catchAll((streamError) => {
      // Handle Effect.fail cases from the stream
      loading = false;
      error = streamError;
      data = null;
      stale = false;
      return Effect.void;
    })
  );

  // Run the effect and store the fiber
  fiber = Effect.runFork(effect);

  // Cleanup function to interrupt the fiber
  const cleanup = () => {
    if (fiber) {
      Effect.runFork(Fiber.interrupt(fiber));
      fiber = null;
    }
  };

  return {
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    get data() {
      return data;
    },
    get stale() {
      return stale;
    },
    get operationResult() {
      return operationResult;
    },
    cleanup,
  };
};

export const makeMutationRune = <
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  client: Client,
  mutation: TypedDocumentNode<Data, Variables>,
  variables?: Variables
) => {
  let loading = $state(false);
  let error = $state<Error | null>(null);
  let data = $state<Data | null>(null);
  let operationResult = $state<OperationResult<Data, Variables> | null>(null);
  let fiber: Fiber.RuntimeFiber<any, any> | null = null;

  // Function to execute the mutation
  const execute = () => {
    if (fiber) {
      Effect.runFork(Fiber.interrupt(fiber));
    }
    loading = true;
    error = null;
    data = null;
    operationResult = null;

    // Create a new stream for each execution
    const stream = makeReactiveMutationEffect(client, mutation, variables);

    // Run the stream effect to update state
    const effect = stream.pipe(
      Stream.runForEach((result: OperationResult<Data, Variables>) => {
        console.log("Mutation rune received result:", result);
        operationResult = result;
        loading = false;
        error = result.error ? result.error : null;
        data = result.data ?? null;
        return Effect.void;
      }),
      Effect.catchAll((streamError) => {
        // Handle Effect.fail cases from the stream
        loading = false;
        error = streamError;
        data = null;
        return Effect.void;
      })
    );

    fiber = Effect.runFork(effect);
  };

  // Cleanup function to interrupt the fiber
  const cleanup = () => {
    if (fiber) {
      Effect.runFork(Fiber.interrupt(fiber));
      fiber = null;
    }
  };

  return {
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    get data() {
      return data;
    },
    get operationResult() {
      return operationResult;
    },
    execute,
    cleanup,
  };
};
