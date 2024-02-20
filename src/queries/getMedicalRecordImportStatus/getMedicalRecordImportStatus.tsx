import gql from "graphql-tag";

export default gql`
  mutation getMedicalRecordImportStatus(
    $input: GetMedicalRecordImportStatusInput!
  ) {
    getMedicalRecordImportStatus(input: $input) {
      requestApiResponse {
        status {
          code
          message
        }
        success
      }
    }
  }
`;
