import gql from "graphql-tag";

export default gql`
  mutation createRequestResponseV1($input: CreateRequestResponseV1Input!) {
    createRequestResponseV1(input: $input) {
      clientMutationId
    }
  }
`;
