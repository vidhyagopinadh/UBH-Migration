import gql from "graphql-tag";

export default gql`
  mutation sendReminderEmail($input: SendReminderEmailInput!) {
    sendReminderEmail(input: $input) {
      clientMutationId
      reminderNotificationResult {
        result
        status
        success
      }
    }
  }
`;
