import { Stream, Effect, Fiber } from "effect/index";
import { makeReactiveQueryEffect } from "./index";
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
