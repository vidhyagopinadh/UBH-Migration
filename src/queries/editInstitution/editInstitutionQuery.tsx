import gql from "graphql-tag";

export default gql`
  mutation editInstitution($input: EditInstitutionInput!) {
    editInstitution(input: $input) {
      clientMutationId
      requestResult {
        result
        status
        success
      }
    }
  }
`;
