import gql from "graphql-tag";

export default gql`
  mutation getPatientMedicalRecordDocument(
    $input: GetPatientMedicalRecordDocumentInput!
  ) {
    getPatientMedicalRecordDocument(input: $input) {
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
