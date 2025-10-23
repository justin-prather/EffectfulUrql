import { gql } from "@urql/core";

export const ReadPeopleQuery = gql`
  query ReadPeople {
    people {
      id
      name
    }
  }
`;

export const InsertPersonMutation = gql`
  mutation InsertPerson($input: CreatePersonInput!) {
    insertPerson(input: $input) {
      id
      name
    }
  }
`;
