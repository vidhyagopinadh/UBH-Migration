import gql from "graphql-tag";

export default gql`
  mutation addNewPatientV1($input: AddNewPatientV1Input!) {
    addNewPatientV1(input: $input) {
      clientMutationId
      requestResult {
        result
        status
        success
      }
    }
  }
`;
