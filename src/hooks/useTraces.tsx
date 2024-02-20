import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { traceSpan } from "../utils/OT/OTTracing";
import { correlationConstants } from "../utils/OT/correlationConstants";

interface IContext {
  action: string;
}
const useTraces = () => {
  const setupFingerprint = (name: string, context: IContext, func: any) => {
    const fpPromise = FingerprintJS.load();
    fpPromise
      .then(async (fp) => await fp.get())
      .then((result) => {
        localStorage.setItem("visitorId", result.visitorId);
        traceSpan(name, context, func);
      });
  };

  const handleTrace = (name: string, context: IContext, func: any) => {
    const visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      setupFingerprint(name, context, func);
    } else {
      traceSpan(name, context, func);
    }
  };

  const getTrace = async (action: string, eventId: string, email: string) => {
    const eventObj = correlationConstants[eventId];
    console.group(
      "%cOT Traces",
      "background-color: #008000 ; color: #ffffff ; font-weight: bold ; padding: 4px ;",
    );
    console.log(eventObj);
    console.groupEnd();
    const inputContext = {
      action: action,
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
      platform: window.navigator.userAgent,
      userName: localStorage.getItem("User"),
      email: email,
    };
    handleTrace(
      eventObj.eventTitle,
      inputContext,
      (spanContext: any, fingerprint: any) => {
        handleUrl(spanContext, fingerprint);
      },
    );
  };
  const handleUrl = async (spanContext: any, fingerprint: any) => {
    const user = {
      spanContext: spanContext,
      fingerprint: fingerprint,
    };
    console.log(user);
  };

  return {
    getTrace,
    handleTrace,
    setupFingerprint,
  };
};

export default useTraces;
