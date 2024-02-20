import gql from "graphql-tag";

export default gql`
  mutation createAddendumRecordsRequest(
    $input: CreateAddendumRecordsRequestInput!
  ) {
    createAddendumRecordsRequest(input: $input) {
      clientMutationId
      recordId
    }
  }
`;
