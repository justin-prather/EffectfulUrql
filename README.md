# EffectfulUrql

A browser package for [urql](https://nearform.com/open-source/urql/docs/api/core/#fetchexchange) with Effect-TS integration. This library provides effectful wrappers around urql's core functionality, enabling type-safe, composable GraphQL operations in the browser.

## Installation

```bash
npm install effectful-urql @urql/core effect
```

For Svelte integration:

```bash
npm install effectful-urql @urql/core effect svelte
```

## Features

- 🎯 **Type-safe**: Full TypeScript support with generated type definitions
- 🌐 **Browser-first**: Built specifically for browser environments
- ⚡ **Effect-TS Integration**: Leverage the power of Effect for composable, type-safe side effects
- 🔌 **urql Compatible**: Works seamlessly with urql's fetchExchange and core APIs
- 🏷️ **Tagged Errors**: Type-safe error handling with dedicated error types for different failure modes
- 🔄 **Reactive Streams**: Support for reactive queries and mutations that update automatically
- 🎨 **Svelte Integration**: Native Svelte runes for reactive state management

## Core API

### Queries

#### `makeQueryEffect`

Creates an Effect that executes a GraphQL query once.

```typescript
import { Client, cacheExchange, fetchExchange, gql } from "@urql/core";
import { makeQueryEffect } from "effectful-urql";
import { Effect } from "effect";

const client = new Client({
  url: "https://api.example.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

const getUserEffect = makeQueryEffect(client, GET_USER, { id: "123" });

const result = await Effect.runPromise(getUserEffect);
console.log(result.user); // { id: "123", name: "...", email: "..." }
```

#### `makeReactiveQueryEffect`

Creates a Stream that emits query results reactively whenever the urql cache updates.

```typescript
import { makeReactiveQueryEffect } from "effectful-urql";
import { Stream } from "effect";

const stream = makeReactiveQueryEffect(client, GET_USER, { id: "123" });

await stream.pipe(
  Stream.runForEach((data) => Effect.sync(() => console.log(data)))
).pipe(Effect.runPromise);
```

### Mutations

#### `makeMutationEffect`

Creates an Effect that executes a GraphQL mutation once.

```typescript
import { makeMutationEffect } from "effectful-urql";

const CREATE_USER = gql`
  mutation CreateUser($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`;

const createUserEffect = makeMutationEffect(client, CREATE_USER, {
  name: "John",
});

const result = await Effect.runPromise(createUserEffect);
console.log(result.createUser); // { id: "...", name: "John" }
```

#### `makeReactiveMutationEffect`

Creates a Stream that emits mutation results reactively.

```typescript
import { makeReactiveMutationEffect } from "effectful-urql";

const stream = makeReactiveMutationEffect(client, CREATE_USER, {
  name: "John",
});

await stream.pipe(
  Stream.runForEach((data) => Effect.sync(() => console.log(data)))
).pipe(Effect.runPromise);
```

## Error Handling

EffectfulUrql provides three distinct tagged error types based on urql's [CombinedError](https://nearform.com/open-source/urql/docs/api/core/#combinederror):

### NetworkError

Network-level errors such as connection failures, timeouts, or DNS resolution issues.

```typescript
import { NetworkError } from "effectful-urql";

const program = getUserEffect.pipe(
  Effect.catchTag("NetworkError", (error) => {
    console.error("Network error:", error.message);
    console.error("Original error:", error.originalError);
    console.error("Response:", error.response);
    return Effect.succeed(null);
  })
);
```

### GraphQLError

GraphQL errors returned by the server in the response.

```typescript
import { GraphQLError } from "effectful-urql";

const program = getUserEffect.pipe(
  Effect.catchTag("GraphQLError", (error) => {
    console.error("GraphQL errors:", error.graphQLErrors);
    error.graphQLErrors.forEach((err) => {
      console.log("Message:", err.message);
      console.log("Path:", err.path);
      console.log("Locations:", err.locations);
      console.log("Extensions:", err.extensions);
    });
    return Effect.succeed(null);
  })
);
```

### QueryError

General query errors that don't fit into the other categories.

```typescript
import { QueryError } from "effectful-urql";

const program = getUserEffect.pipe(
  Effect.catchTag("QueryError", (error) => {
    console.error("Query error:", error.message);
    console.error("Combined error:", error.combinedError);
    return Effect.succeed(null);
  })
);
```

### Handling All Error Types

You can handle all error types at once using `Effect.catchTags`:

```typescript
const program = getUserEffect.pipe(
  Effect.catchTags({
    NetworkError: (error) => {
      return Effect.succeed({ type: "network-error" as const });
    },
    GraphQLError: (error) => {
      return Effect.succeed({ type: "graphql-error" as const });
    },
    QueryError: (error) => {
      return Effect.succeed({ type: "query-error" as const });
    },
  })
);

const result = await Effect.runPromise(program);
```

### Advanced Pattern: Retry Logic

Combine with Effect's retry functionality for robust error handling:

```typescript
import { Schedule } from "effect";

const program = getUserEffect.pipe(
  Effect.retry({
    schedule: Schedule.exponential("100 millis").pipe(
      Schedule.compose(Schedule.recurs(3))
    ),
    while: (error) => error._tag === "NetworkError",
  }),
  Effect.catchTags({
    NetworkError: (error) => Effect.succeed({ error: "Network unavailable" }),
    GraphQLError: (error) =>
      Effect.succeed({ error: error.graphQLErrors[0].message }),
    QueryError: (error) => Effect.succeed({ error: error.message }),
  })
);
```

## Svelte Integration

The library provides Svelte-specific exports for reactive state management using Svelte 5 runes.

### Import

```typescript
import { makeQueryRune, makeMutationRune } from "effectful-urql/svelte";
```

### Query Rune

```svelte
<script lang="ts">
  import { Client, cacheExchange, fetchExchange } from "@urql/core";
  import { makeQueryRune } from "effectful-urql/svelte";
  import { GET_USER } from "./queries";

  const client = new Client({
    url: "https://api.example.com/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

  const userQuery = makeQueryRune(client, GET_USER, { id: "123" });

  // Cleanup on component destroy
  import { onDestroy } from "svelte";
  onDestroy(() => userQuery.cleanup());
</script>

{#if $userQuery.loading}
  <p>Loading...</p>
{:else if $userQuery.error}
  <p>Error: {$userQuery.error.message}</p>
{:else if $userQuery.data}
  <div>
    <h1>{$userQuery.data.user.name}</h1>
    <p>{$userQuery.data.user.email}</p>
  </div>
{/if}
```

### Mutation Rune

```svelte
<script lang="ts">
  import { makeMutationRune } from "effectful-urql/svelte";
  import { CREATE_USER } from "./queries";

  const createUserMutation = makeMutationRune(client, CREATE_USER);

  async function handleSubmit() {
    createUserMutation.execute();
    // Variables are set when creating the rune, or you can modify the mutation
  }

  import { onDestroy } from "svelte";
  onDestroy(() => createUserMutation.cleanup());
</script>

<button onclick={handleSubmit} disabled={$createUserMutation.loading}>
  {#if $createUserMutation.loading}
    Creating...
  {:else}
    Create User
  {/if}
</button>

{#if $createUserMutation.error}
  <p class="error">{$createUserMutation.error.message}</p>
{/if}
```

### Rune API

Both `makeQueryRune` and `makeMutationRune` return objects with the following properties:

- `loading`: Reactive state indicating if the operation is in progress
- `error`: Reactive state containing any error that occurred
- `data`: Reactive state containing the successful result data
- `stale`: (Query only) Reactive state indicating if the data is stale
- `operationResult`: Reactive state containing the full urql OperationResult
- `cleanup()`: Function to unsubscribe and clean up resources

## GraphQL Code Generation

The project includes GraphQL Codegen configuration for generating type-safe GraphQL operations. Configure your schemas in `codegen.ts`:

```typescript
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://your-api.com/graphql",
  documents: "./src/queries/**/*.{graphql,ts}",
  generates: {
    "./src/generated/": {
      preset: "client",
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
```

Run code generation:

```bash
npm run codegen
```

## Development

```bash
# Install dependencies
npm install

# Build the project (outputs to dist/ with .d.ts type definitions)
npm run build

# Watch mode for development
npm run dev

# Clean build artifacts
npm run clean
```

## Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Project Structure

```
├── src/
│   ├── index.ts              # Core Effect API (queries, mutations, errors)
│   ├── index.svelte.ts       # Svelte runes integration
│   ├── generated/            # Generated GraphQL types (not committed)
│   │   ├── pokemon/         # Pokemon API types
│   │   └── local/            # Local API types
│   ├── queries/             # GraphQL query definitions
│   │   ├── pokemon/
│   │   └── local/
│   └── *.test.ts            # Test files
├── dist/                    # Compiled output (generated)
│   ├── *.js                 # ES modules
│   ├── *.d.ts               # Type definitions
│   └── *.js.map             # Source maps
├── codegen.ts               # GraphQL Codegen configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Build Output

The build process generates:

- **ES Modules** (`dist/*.js`) - Modern ESM format for browsers and bundlers
- **Type Definitions** (`dist/*.d.ts`) - Full TypeScript type information
- **Source Maps** (`dist/*.js.map`) - For debugging

## Exports

The package exports two entry points:

- **Main**: `effectful-urql` - Core Effect-based API
- **Svelte**: `effectful-urql/svelte` - Svelte runes integration

## References

- [urql Documentation](https://nearform.com/open-source/urql/docs/api/core/#fetchexchange)
- [Effect-TS](https://effect.website/)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)

## License

ISC
