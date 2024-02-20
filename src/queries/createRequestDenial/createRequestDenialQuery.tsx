import gql from "graphql-tag";

export default gql`
  mutation createRequestDenialLetter($input: CreateRequestDenialLetterInput!) {
    createRequestDenialLetter(input: $input) {
      clientMutationId
      requestResult {
        result
        status
        success
      }
    }
  }
`;
