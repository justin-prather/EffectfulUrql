import { gql } from "@urql/core";

export const GetPokemonQuery = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      name
      number
      image
      classification
      types
    }
  }
`;

export const BadNetworkQuery = gql`
  query BadNetworkQuery($name: String!) {
    pokemon(name: $name) {
      name
    }
  }
`;
