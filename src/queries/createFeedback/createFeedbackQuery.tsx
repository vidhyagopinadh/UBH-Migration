import gql from "graphql-tag";

export default gql`
  mutation createFeedbackV1($input: CreateFeedbackV1Input!) {
    createFeedbackV1(input: $input) {
      feedbackResult {
        result
        status
        success
      }
    }
  }
`;
