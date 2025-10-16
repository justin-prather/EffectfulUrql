# EffectfulUrql

A browser package for [urql](https://nearform.com/open-source/urql/docs/api/core/#fetchexchange) with Effect-TS integration. This library provides effectful wrappers around urql's core functionality, enabling type-safe, composable GraphQL operations in the browser.

## Installation

```bash
npm install effectful-urql @urql/core effect
```

## Features

- 🎯 **Type-safe**: Full TypeScript support with generated type definitions
- 🌐 **Browser-first**: Built specifically for browser environments
- ⚡ **Effect-TS Integration**: Leverage the power of Effect for composable, type-safe side effects
- 🔌 **urql Compatible**: Works seamlessly with urql's fetchExchange and core APIs
- 🏷️ **Tagged Errors**: Type-safe error handling with dedicated error types for different failure modes

## Usage

### Basic Example

```typescript
import { Client, cacheExchange, fetchExchange, gql } from "@urql/core";
import { makeQueryEffect } from "effectful-urql";
import { Effect } from "effect";

// Create a urql client
const client = new Client({
  url: "https://api.example.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

// Define your query
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

// Create an Effect that executes the query
const getUserEffect = makeQueryEffect(client, GET_USER, { id: "123" });

// Run the effect
const result = await Effect.runPromise(getUserEffect);
console.log(result.user); // { id: "123", name: "...", email: "..." }
```

### Error Handling

EffectfulUrql provides three distinct tagged error types based on urql's [CombinedError](https://nearform.com/open-source/urql/docs/api/core/#combinederror):

#### 1. NetworkError

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

#### 2. GraphQLError

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

#### 3. QueryError

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
      // Handle network errors
      return Effect.succeed({ type: "network-error" as const });
    },
    GraphQLError: (error) => {
      // Handle GraphQL errors
      return Effect.succeed({ type: "graphql-error" as const });
    },
    QueryError: (error) => {
      // Handle other query errors
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
  // Retry network errors with exponential backoff
  Effect.retry({
    schedule: Schedule.exponential("100 millis").pipe(
      Schedule.compose(Schedule.recurs(3))
    ),
    while: (error) => error._tag === "NetworkError",
  }),
  // Handle errors that persist after retries
  Effect.catchTags({
    NetworkError: (error) => Effect.succeed({ error: "Network unavailable" }),
    GraphQLError: (error) =>
      Effect.succeed({ error: error.graphQLErrors[0].message }),
    QueryError: (error) => Effect.succeed({ error: error.message }),
  })
);
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
├── src/          # Source files (TypeScript)
├── dist/         # Compiled output with type definitions (generated)
│   ├── *.js      # ES modules
│   ├── *.d.ts    # Type definitions
│   └── *.js.map  # Source maps
├── package.json
├── tsconfig.json
└── README.md
```

## Build Output

The build process generates:

- **ES Modules** (`dist/*.js`) - Modern ESM format for browsers and bundlers
- **Type Definitions** (`dist/*.d.ts`) - Full TypeScript type information
- **Source Maps** (`dist/*.js.map`) - For debugging

## References

- [urql Documentation](https://nearform.com/open-source/urql/docs/api/core/#fetchexchange)
- [Effect-TS](https://effect.website/)

## License

ISC
