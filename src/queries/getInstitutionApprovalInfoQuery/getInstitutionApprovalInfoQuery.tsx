import gql from "graphql-tag";

export default gql`
  mutation getInstitutionApprovalInfo(
    $input: GetInstitutionApprovalInfoInput!
  ) {
    getInstitutionApprovalInfo(input: $input) {
      results {
        approvedMetaValue
        communicationMetaValue
        id
      }
    }
  }
`;
