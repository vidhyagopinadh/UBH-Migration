import gql from "graphql-tag";

export default gql`
  mutation addDependent($input: AddDependentInput!) {
    addDependent(input: $input) {
      clientMutationId
      requestResult {
        result
        status
        success
      }
    }
  }
`;
