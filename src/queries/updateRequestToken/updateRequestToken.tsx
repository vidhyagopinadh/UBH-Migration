import gql from "graphql-tag";

export default gql`
  mutation updateRequestTokens($input: UpdateRequestTokensInput!) {
    updateRequestTokens(input: $input) {
      clientMutationId
      recordId
    }
  }
`;
