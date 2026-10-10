import { describe, expect, it, vi } from "vitest";
import { Client, CombinedError, createRequest, gql } from "@urql/core";
import { Effect, Stream } from "effect";
import {
  GraphQLError,
  makeReactiveMutationEffect,
  makeReactiveQueryEffect,
  makeUrqlClientLayer,
} from "./index";

describe("Reactive subscription cleanup", () => {
  it.each([
    ["query", makeReactiveQueryEffect],
    ["mutation", makeReactiveMutationEffect],
  ] as const)("unsubscribes after a synchronous %s error", async (kind, makeStream) => {
    const client = new Client({ url: "http://unused/graphql", exchanges: [] });
    const document = gql(`${kind} Test { test }`);
    const operation = client.createRequestOperation(
      kind,
      createRequest(document, {}),
    );
    const unsubscribe = vi.fn();
    const source = client[kind](document, {});
    vi.spyOn(source, "subscribe").mockImplementation((callback) => {
      callback({
        operation,
        error: new CombinedError({ graphQLErrors: [{ message: "invalid" }] }),
        stale: false,
        hasNext: false,
      });
      return { unsubscribe };
    });
    vi.spyOn(client, kind).mockReturnValue(source);

    const error = await Effect.runPromise(
      makeStream(document, {}).pipe(
        Stream.runDrain,
        Effect.catch((error) => Effect.succeed(error)),
        Effect.provide(makeUrqlClientLayer(client)),
      ),
    );

    expect(error).toBeInstanceOf(GraphQLError);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
