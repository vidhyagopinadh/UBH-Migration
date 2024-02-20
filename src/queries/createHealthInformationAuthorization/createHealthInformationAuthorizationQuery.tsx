import gql from "graphql-tag";

export default gql`
  mutation createHealthInformationAuthorization(
    $input: CreateHealthInformationAuthorizationInput!
  ) {
    createHealthInformationAuthorization(input: $input) {
      clientMutationId
      recordId
    }
  }
`;
