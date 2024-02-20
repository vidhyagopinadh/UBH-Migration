import gql from "graphql-tag";

export default gql`
  mutation createFileUpload($input: CreateFileUploadInput!) {
    createFileUpload(input: $input) {
      clientMutationId
      fileUpload {
        id
      }
    }
  }
`;
