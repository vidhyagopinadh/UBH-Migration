import gql from "graphql-tag";

export default gql`
  mutation initIdentityVerificationV1(
    $input: InitIdentityVerificationV1Input!
  ) {
    initIdentityVerificationV1(input: $input) {
      verificationMeta {
        patientExternalId
        patientId
        transactionId
        status
        message
        externalSystem {
          idVerificationBaseUrl
          name
          params {
            key
            value
          }
        }
      }
    }
  }
`;
