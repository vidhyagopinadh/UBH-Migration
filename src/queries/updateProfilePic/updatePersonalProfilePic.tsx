import gql from "graphql-tag";

export default gql`
  mutation updatePersonProfilePic($input: UpdatePersonProfilePicInput!) {
    updatePersonProfilePic(input: $input) {
      requestResult {
        result
        status
        success
      }
    }
  }
`;
