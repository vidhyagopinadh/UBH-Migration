import gql from "graphql-tag";

export default gql`
  mutation userMedicalRecordOperationStatusHistory(
    $input: UserMedicalRecordOperationStatusHistoryInput!
  ) {
    userMedicalRecordOperationStatusHistory(input: $input) {
      requestApiResponse {
        data
        status {
          code
          message
        }
        success
      }
    }
  }
`;
