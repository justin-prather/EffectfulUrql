/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetPokemonQueryVariables = Exact<{
  name: string;
}>;


export type GetPokemonQuery = { pokemon: { name: string | null, number: string | null, image: string | null, classification: string | null, types: Array<string | null> | null } | null };

export type BadNetworkQueryQueryVariables = Exact<{
  name: string;
}>;


export type BadNetworkQueryQuery = { pokemon: { name: string | null } | null };


export const GetPokemonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPokemon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"classification"}},{"kind":"Field","name":{"kind":"Name","value":"types"}}]}}]}}]} as unknown as DocumentNode<GetPokemonQuery, GetPokemonQueryVariables>;
export const BadNetworkQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BadNetworkQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BadNetworkQueryQuery, BadNetworkQueryQueryVariables>;