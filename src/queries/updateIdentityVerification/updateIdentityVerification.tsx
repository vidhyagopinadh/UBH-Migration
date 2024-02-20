import gql from "graphql-tag";

export default gql`
  mutation updateIdentityVerificationV1(
    $input: UpdateIdentityVerificationV1Input!
  ) {
    updateIdentityVerificationV1(input: $input) {
      requestResult {
        result
        status
        success
      }
    }
  }
`;
