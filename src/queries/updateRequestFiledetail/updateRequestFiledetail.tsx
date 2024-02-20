import gql from "graphql-tag";

export default gql`
  mutation updateRequestFiledetailV1($input: UpdateRequestFiledetailV1Input!) {
    updateRequestFiledetailV1(input: $input) {
      clientMutationId
    }
  }
`;
