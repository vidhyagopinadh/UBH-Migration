import gql from "graphql-tag";

export default gql`
  mutation createMedicalRecordsRequest(
    $input: CreateMedicalRecordsRequestInput!
  ) {
    createMedicalRecordsRequest(input: $input) {
      clientMutationId
      requestResult {
        success
        status
        result
      }
    }
  }
`;
