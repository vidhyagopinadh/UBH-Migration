import gql from "graphql-tag";

export default gql`
  mutation saveExternalIntegration($input: SaveExternalIntegrationInput!) {
    saveExternalIntegration(input: $input) {
      requestResult {
        result
        status
        success
      }
    }
  }
`;
