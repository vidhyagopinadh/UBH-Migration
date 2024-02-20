import gql from "graphql-tag";

export default gql`
  mutation modifyDependentInfo($input: ModifyDependentInfoInput!) {
    modifyDependentInfo(input: $input) {
      clientMutationId
      requestResult {
        result
        status
        success
      }
    }
  }
`;
