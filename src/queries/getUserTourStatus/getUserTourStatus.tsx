import gql from "graphql-tag";

export default gql`
  query getUserTourStatus($tourTypeName: String!) {
    getUserTourStatus(tourTypeName: $tourTypeName) {
      data {
        completedSteps
        isCompleted
        lastCompletedStepIndex
        lastUpdateTimestamp
        resumeAfter
        tourTargetId
        tourTriggerType
        tourTypeId
        autoResume
      }
      status {
        code
        message
      }
      success
    }
  }
`;
