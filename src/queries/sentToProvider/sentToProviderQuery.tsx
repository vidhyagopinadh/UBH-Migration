import gql from "graphql-tag";

export default gql`
  mutation sentRequestToProvider($input: SentRequestToProviderInput!) {
    sentRequestToProvider(input: $input) {
      userInviteId
    }
  }
`;
