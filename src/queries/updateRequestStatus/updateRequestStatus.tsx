import gql from "graphql-tag";

export default gql`
  mutation updateRequestStatusV2($input: UpdateRequestStatusV2Input!) {
    updateRequestStatusV2(input: $input) {
      clientMutationId
      requestResult {
        success
        status
        result
      }
    }
  }
`;
