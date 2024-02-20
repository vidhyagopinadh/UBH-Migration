import gql from "graphql-tag";

export default gql`
  mutation patientDetailsV1($input: PatientDetailsV1Input!) {
    patientDetailsV1(input: $input) {
      clientMutationId
      results {
        id
        partyId
        firstName
        lastName
        middleName
        personType
        phoneNumber
        recordStatus
        electronicDetails
        birthDate
        addressZip
        state
        addressLine2
        addressLine1
        country
        city
      }
    }
  }
`;
