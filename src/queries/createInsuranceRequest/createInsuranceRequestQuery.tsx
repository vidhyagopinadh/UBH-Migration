import gql from "graphql-tag";

export default gql`
  mutation createInsuranceRequestV1($input: CreateInsuranceRequestV1Input!) {
    createInsuranceRequestV1(input: $input) {
      clientMutationId
    }
  }
`;
