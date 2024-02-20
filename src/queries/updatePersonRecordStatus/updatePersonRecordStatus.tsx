import gql from "graphql-tag";

export default gql`
  mutation updatePersonRecordStatusV1(
    $input: UpdatePersonRecordStatusV1Input!
  ) {
    updatePersonRecordStatusV1(input: $input) {
      clientMutationId
      recordId
    }
  }
`;
