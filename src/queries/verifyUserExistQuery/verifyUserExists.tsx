import gql from "graphql-tag";

export default gql`
  mutation verifyUserExists($input: VerifyUserExistsInput!) {
    verifyUserExists(input: $input) {
      clientMutationId
      userExists
    }
  }
`;
