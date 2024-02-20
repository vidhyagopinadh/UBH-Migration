import gql from "graphql-tag";

export default gql`
  mutation validateUserProfileV1($input: ValidateUserProfileV1Input!) {
    validateUserProfileV1(input: $input) {
      validationInfo {
        message
        status
        data {
          field
          fieldValue
          message
          status
        }
      }
    }
  }
`;
