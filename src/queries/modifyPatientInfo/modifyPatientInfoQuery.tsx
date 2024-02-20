import gql from "graphql-tag";

export default gql`
  mutation modifyPatientInfo($input: ModifyPatientInfoInput!) {
    modifyPatientInfo(input: $input) {
      clientMutationId
      requestResult {
        result
        status
        success
      }
    }
  }
`;
