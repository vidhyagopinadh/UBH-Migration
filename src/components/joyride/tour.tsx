import React, { useEffect, useReducer, useState } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { joyrideTheme } from "../../lib/universal/utils/tour/joyrideCss";
// import { useSelector } from "react-redux";
// import type { AppState } from "../../types";
// import { Help } from "@material-ui/icons";
import HelpIcon from '@mui/icons-material/Help';
import type {
  SaveUserTourProgressInput,
  SaveUserTourProgressMutation,
  SaveUserTourProgressMutationVariables,
  TourResponseType,
} from "../../__generated__/typescript-operations_all";
//import saveUserTourProgress from "../../queries/saveUserTourProgress/saveUserTourProgress";
//import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { BootstrapTooltip as Tooltip } from "../Tooltip";
import { useTranslate } from "react-admin";
import getUserTourStatus from "../../queries/getUserTourStatus/getUserTourStatus";
import moment from "moment";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";
import saveUserTourProgress from "../../queries/saveUserTourProgress/saveUserTourProgress";
interface ITourProps {
  tourSteps: object;
  type?: string;
}
const { VITE_BASE_URL } = import.meta.env;
const Tour = ({ tourSteps, type = "" }: ITourProps) => {
  const translate = useTranslate();
  const [tourProgress, setTourProgress] = useState<SaveUserTourProgressInput>({
    tourData: {
      tourTypeValue: type,
      completedSteps: 0,
      tourTargetId: null,
      lastCompletedStepIndex: 0,
      isCompleted: false,
      tourTriggerType: 0,
    },
    feedbackData: {
      feedback: null,
      feedbackTypeName: type,
      rating: null,
    },
  });
  const [submitTourProgress, setSubmitTourProgress] = useState<boolean>(false);
  const [tourResponse, setTourResponse] = useState<TourResponseType>({});
  // const feedback = useSelector((state: AppState) => state.feedbackReducer);
  let feedback: any;
  const INITIAL_STATE = {
    key: new Date(),
    run: false,
    continuous: true,
    loading: false,
    stepIndex: 0,
    steps: tourSteps,
    type: type,
  };
  const reducer = (state = INITIAL_STATE, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case "START":
        return { ...state, run: true };
      case "RESET":
        return { ...state, stepIndex: 0 };
      case "STOP":
        return { ...state, run: false };
      case "NEXT_OR_PREV":
        return { ...state, ...action.payload };
      case "RESTART":
        return {
          ...state,
          stepIndex: 0,
          run: true,
          loading: false,
          key: new Date(),
        };
      default:
        return state;
    }
  };
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("md"));
  const [subscribeSaveTourProgressMutation] = useMutation<
    SaveUserTourProgressMutation,
    SaveUserTourProgressMutationVariables
  >(saveUserTourProgress, {});
  const [getUserTourStatusQuery, { data }] = useLazyQuery(getUserTourStatus, {
    variables: { tourTypeName: type },
  });
  useEffect(() => {
    getUserTourStatusQuery();
    setTourResponse(data?.getUserTourStatus.data);
    if (tourResponse !== undefined) {
      if (
        moment().isAfter(tourResponse?.resumeAfter) &&
        tourResponse?.autoResume &&
        !tourResponse?.isCompleted &&
        window.location.href === VITE_BASE_URL + "/"
      ) {
        startTour(1);
      } else if (!tourResponse) {
        startTour(1);
      }
    }
  }, [data, tourResponse]);
  useEffect(() => {
    if (submitTourProgress) {
      subscribeSaveTourProgressMutation({
        variables: {
          input: tourProgress,
        },
      }).then((res) => {
        if (res.data.saveUserTourProgress.responseResultStatus.success) {
          setSubmitTourProgress(false);
        }
      });
    }
  }, [submitTourProgress]);
  const callback = (data: { action: any; index: any; type: any; status: any; }) => {
    const { action, index, type, status } = data;
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      if (
        (status === STATUS.SKIPPED && tourState.run) ||
        action === ACTIONS.CLOSE
      ) {
        setTourProgress((prevFormState) => ({
          ...prevFormState,
          tourData: {
            ...prevFormState.tourData,
            completedSteps: tourState?.stepIndex,
            lastCompletedStepIndex: tourState?.stepIndex,
            tourTargetId: tourState?.steps[tourState.stepIndex].target,
            isCompleted: false,
          },
        }));
        setSubmitTourProgress(true);
      }

      if (status === STATUS.FINISHED) {
        setTourProgress((prevFormState) => ({
          ...prevFormState,
          tourData: {
            ...prevFormState.tourData,
            isCompleted: true,
          },
          feedbackData: {
            ...prevFormState.feedbackData,
            feedback: feedback.feedbackData,
            rating: feedback.rating,
          },
        }));
        setSubmitTourProgress(true);
      }

      dispatch({ type: "STOP" });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setTourProgress((prevFormState) => ({
        ...prevFormState,
        tourData: {
          ...prevFormState.tourData,
          completedSteps: tourState?.stepIndex,
          lastCompletedStepIndex: tourState?.stepIndex,
          tourTargetId: tourState?.steps[tourState.stepIndex].target,
        },
      }));
      dispatch({
        type: "NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      });
    }
  };

  const startTour = (triggerType: number): void => {
    dispatch({ type: "RESTART" });
    setTourProgress((prevFormState) => ({
      ...prevFormState,
      tourData: {
        ...prevFormState.tourData,
        tourTriggerType: triggerType,
      },
    }));
  };

  return (
    <>
      <Tooltip
        arrow
        placement="top"
        title={mobileDevice ? "" : translate("tooltip.tour.startTour")}
      >
        <IconButton
          onClick={() => {
            startTour(2);
          }}
          style={{ margin: "0px", padding: "0px" }}
        >
          <HelpIcon style={{ color: "#5eb562" }} />
        </IconButton>
      </Tooltip>
      <JoyRide
        {...tourState}
        callback={callback}
        showSkipButton={true}
        showProgress={true}
        styles={joyrideTheme}
        disableOverlayClose={true}
        disableCloseOnEsc={true}
        locale={{
          last: (
            <b
              aria-label="skip"
              style={{
                fontSize: "14px",
              }}
            >
              Submit Feedback
            </b>
          ),
          skip: (
            <b aria-label="skip" style={{ fontSize: "14px" }}>
              Skip
            </b>
          ),
          next: (
            <b aria-label="next" style={{ fontSize: "14px" }}>
              Next
            </b>
          ),
          back: (
            <b aria-label="previous" style={{ fontSize: "14px" }}>
              Previous
            </b>
          ),
        }}
      />
    </>
  );
};

export default Tour;
