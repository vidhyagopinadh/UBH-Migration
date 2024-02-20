import gql from "graphql-tag";

export default gql`
  mutation saveUserTourProgress($input: SaveUserTourProgressInput!) {
    saveUserTourProgress(input: $input) {
      responseResultStatus {
        status {
          code
          message
        }
        success
      }
    }
  }
`;
