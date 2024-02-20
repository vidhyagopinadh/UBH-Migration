import gql from "graphql-tag";

export default gql`
  mutation createNotificationRead($input: CreateNotificationReadInput!) {
    createNotificationRead(input: $input) {
      clientMutationId
    }
  }
`;
