import gql from "graphql-tag";

export default gql`
  mutation getNotificationDetails($input: GetNotificationDetailsInput!) {
    getNotificationDetails(input: $input) {
      clientMutationId
      json
    }
  }
`;
