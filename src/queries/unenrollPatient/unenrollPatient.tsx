import gql from "graphql-tag";

export default gql`
  mutation unenrollPatient($input: UnenrollPatientInput!) {
    unenrollPatient(input: $input) {
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
