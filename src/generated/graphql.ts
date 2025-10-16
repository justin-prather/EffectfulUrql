/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** Represents a Pokémon's attack types */
export type Attack = {
  __typename?: 'Attack';
  /** The damage of this Pokémon attack */
  damage?: Maybe<Scalars['Int']['output']>;
  /** The name of this Pokémon attack */
  name?: Maybe<Scalars['String']['output']>;
  /** The type of this Pokémon attack */
  type?: Maybe<Scalars['String']['output']>;
};

/** Represents a Pokémon */
export type Pokemon = {
  __typename?: 'Pokemon';
  /** The attacks of this Pokémon */
  attacks?: Maybe<PokemonAttack>;
  /** The classification of this Pokémon */
  classification?: Maybe<Scalars['String']['output']>;
  /** The evolution requirements of this Pokémon */
  evolutionRequirements?: Maybe<PokemonEvolutionRequirement>;
  /** The evolutions of this Pokémon */
  evolutions?: Maybe<Array<Maybe<Pokemon>>>;
  fleeRate?: Maybe<Scalars['Float']['output']>;
  /** The minimum and maximum weight of this Pokémon */
  height?: Maybe<PokemonDimension>;
  /** The ID of an object */
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  /** The maximum CP of this Pokémon */
  maxCP?: Maybe<Scalars['Int']['output']>;
  /** The maximum HP of this Pokémon */
  maxHP?: Maybe<Scalars['Int']['output']>;
  /** The name of this Pokémon */
  name?: Maybe<Scalars['String']['output']>;
  /** The identifier of this Pokémon */
  number?: Maybe<Scalars['String']['output']>;
  /** The type(s) of Pokémons that this Pokémon is resistant to */
  resistant?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The type(s) of this Pokémon */
  types?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The type(s) of Pokémons that this Pokémon weak to */
  weaknesses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The minimum and maximum weight of this Pokémon */
  weight?: Maybe<PokemonDimension>;
};

/** Represents a Pokémon's attack types */
export type PokemonAttack = {
  __typename?: 'PokemonAttack';
  /** The fast attacks of this Pokémon */
  fast?: Maybe<Array<Maybe<Attack>>>;
  /** The special attacks of this Pokémon */
  special?: Maybe<Array<Maybe<Attack>>>;
};

/** Represents a Pokémon's dimensions */
export type PokemonDimension = {
  __typename?: 'PokemonDimension';
  /** The maximum value of this dimension */
  maximum?: Maybe<Scalars['String']['output']>;
  /** The minimum value of this dimension */
  minimum?: Maybe<Scalars['String']['output']>;
};

/** Represents a Pokémon's requirement to evolve */
export type PokemonEvolutionRequirement = {
  __typename?: 'PokemonEvolutionRequirement';
  /** The amount of candy to evolve */
  amount?: Maybe<Scalars['Int']['output']>;
  /** The name of the candy to evolve */
  name?: Maybe<Scalars['String']['output']>;
};

/** Query any Pokémon by number or name */
export type Query = {
  __typename?: 'Query';
  pokemon?: Maybe<Pokemon>;
  pokemons?: Maybe<Array<Maybe<Pokemon>>>;
  query?: Maybe<Query>;
};


/** Query any Pokémon by number or name */
export type QueryPokemonArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


/** Query any Pokémon by number or name */
export type QueryPokemonsArgs = {
  first: Scalars['Int']['input'];
};

export type GetPokemonQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type GetPokemonQuery = { __typename?: 'Query', pokemon?: { __typename?: 'Pokemon', name?: string | null } | null };

export type BadGraphQlQueryQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type BadGraphQlQueryQuery = { __typename?: 'Query', pokemon?: { __typename?: 'Pokemon', id: string } | null };

export type BadNetworkQueryQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type BadNetworkQueryQuery = { __typename?: 'Query', pokemon?: { __typename?: 'Pokemon', name?: string | null } | null };


export const GetPokemonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPokemon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetPokemonQuery, GetPokemonQueryVariables>;
export const BadGraphQlQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BadGraphQLQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BadGraphQlQueryQuery, BadGraphQlQueryQueryVariables>;
export const BadNetworkQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BadNetworkQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BadNetworkQueryQuery, BadNetworkQueryQueryVariables>;