import gql from "graphql-tag";

export default gql`
  mutation deleteExternalSystem($input: DeleteExternalSystemInput!) {
    deleteExternalSystem(input: $input) {
      requestResult {
        result
        status
        success
      }
    }
  }
`;
