import gql from "graphql-tag";

export default gql`
  mutation createSubstanceUseDisorderAuthorization(
    $input: CreateSubstanceUseDisorderAuthorizationInput!
  ) {
    createSubstanceUseDisorderAuthorization(input: $input) {
      clientMutationId
      recordId
    }
  }
`;
