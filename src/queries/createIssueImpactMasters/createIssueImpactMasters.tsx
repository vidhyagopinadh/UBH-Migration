import gql from "graphql-tag";

export default gql`
  mutation createIssueImpactMasters($input: CreateIssueImpactMastersInput!) {
    createIssueImpactMasters(input: $input) {
      clientMutationId
    }
  }
`;
