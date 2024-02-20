import gql from "graphql-tag";

export default gql`
  mutation createIssueDescriptionMasters(
    $input: CreateIssueDescriptionMastersInput!
  ) {
    createIssueDescriptionMasters(input: $input) {
      clientMutationId
    }
  }
`;
