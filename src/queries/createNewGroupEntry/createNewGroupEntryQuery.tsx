import gql from "graphql-tag";

export default gql`
  mutation createNewGroupEntry($input: CreateNewGroupEntryInput!) {
    createNewGroupEntry(input: $input) {
      institutionResult {
        communicationRequestId
        error
        message
        status
        data {
          institutionAddress
          institutionCity
          institutionCountry
          institutionEmail
          institutionFax
          institutionName
          institutionId
          institutionPhone
          institutionState
          institutionWebsite
          institutionZipcode
          institutionPartyId
          projectId
        }
      }
    }
  }
`;
