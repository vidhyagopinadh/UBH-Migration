import gql from "graphql-tag";

export default gql`
  mutation getPatientIndividualMedicalRecordDocument(
    $input: GetPatientIndividualMedicalRecordDocumentInput!
  ) {
    getPatientIndividualMedicalRecordDocument(input: $input) {
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
