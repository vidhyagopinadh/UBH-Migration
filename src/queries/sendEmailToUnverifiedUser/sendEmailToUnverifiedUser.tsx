import gql from "graphql-tag";

export default gql`
  mutation sendEmailToUnverifiedUser($input: SendEmailToUnverifiedUserInput!) {
    sendEmailToUnverifiedUser(input: $input) {
      json
    }
  }
`;
