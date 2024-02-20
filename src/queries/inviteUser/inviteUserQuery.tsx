import gql from "graphql-tag";

export default gql`
  mutation inviteUserV1($input: InviteUserV1Input!) {
    inviteUserV1(input: $input) {
      clientMutationId
      results {
        middleName
        createdAt
        email
        firstName
        lastName
        userExist
        phone
      }
    }
  }
`;
