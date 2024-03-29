import gql from "graphql-tag";

export default gql`
  mutation deleteRequestV2($input: DeleteRequestV2Input!) {
    deleteRequestV2(input: $input) {
      requestResult {
        success
        status
        result
      }
    }
  }
`;
