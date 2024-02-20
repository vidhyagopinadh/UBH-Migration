import gql from "graphql-tag";

export default gql`
  mutation createPersonDemographics($input: CreatePersonDemographicsInput!) {
    createPersonDemographics(input: $input) {
      clientMutationId
    }
  }
`;
