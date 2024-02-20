import gql from "graphql-tag";

export default gql`
  mutation getIdVerificationTransaction(
    $input: GetIdVerificationTransactionInput!
  ) {
    getIdVerificationTransaction(input: $input) {
      transactionRequestLogResponse {
        data {
          createdAt
          externalSystemPartyId
          id
          partyId
          transactionId
          transactionLog
          verificationResponse
          verificationStatus
          verifiedAt
        }
        status {
          code
          message
        }
        success
      }
    }
  }
`;
