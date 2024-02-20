import gql from "graphql-tag";

export default gql`
  mutation deleteInvite($input: DeleteInviteInput!) {
    deleteInvite(input: $input) {
      clientMutationId
    }
  }
`;
