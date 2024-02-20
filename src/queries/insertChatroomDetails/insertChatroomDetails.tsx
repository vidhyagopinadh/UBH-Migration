import gql from "graphql-tag";

export default gql`
  mutation insertChatroomDetails($input: InsertChatroomDetailsInput!) {
    insertChatroomDetails(input: $input) {
      clientMutationId
      boolean
    }
  }
`;
