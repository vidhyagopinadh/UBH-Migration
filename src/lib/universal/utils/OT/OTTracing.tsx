import type { Span } from "@opentelemetry/api";
import { context, trace, SpanStatusCode } from "@opentelemetry/api";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { Resource } from "@opentelemetry/resources";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { CollectorTraceExporter } from "@opentelemetry/exporter-collector";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { isMobile, isTablet } from "react-device-detect";
interface ISpan {
  spanId: string;
  traceFlags: string;
  traceId: string
}
const { VITE_OT_SERVICE_NAME, VITE_OT_TRACING_URL } = import.meta.env;
const resource = new Resource({
  "service.name": String(VITE_OT_SERVICE_NAME),
});
const provider = new WebTracerProvider({ resource });

const collector = new CollectorTraceExporter({
  url: VITE_OT_TRACING_URL,
  headers: {},
});
// provider.addSpanProcessor(new SimpleSpanProcessor(collector));
provider.register({ contextManager: new ZoneContextManager() });

const webTracerWithZone = provider.getTracer(String(VITE_OT_SERVICE_NAME));

declare const window: any;
let bindingSpan: Span | undefined;

window.startBindingSpan = (
  traceId: string,
  spanId: string,
  traceFlags: number,
) => {
  bindingSpan = webTracerWithZone.startSpan("");
  bindingSpan.spanContext().traceId = traceId;
  bindingSpan.spanContext().spanId = spanId;
  bindingSpan.spanContext().traceFlags = traceFlags;
};

window.flushTraces = () => {
  provider.activeSpanProcessor.forceFlush().then(() => console.log("flushed"));
};

registerInstrumentations({
  instrumentations: [
    // new FetchInstrumentation({
    //   propagateTraceHeaderCorsUrls: ["/.*/g"],
    //   clearTimingResources: true,
    //   applyCustomAttributesOnSpan: (
    //     span: Span,
    //     request: Request | RequestInit,
    //     result: Response | FetchError
    //   ) => {
    //     const attributes = (span as any).attributes;
    //     if (attributes.component === "fetch") {
    //       span.updateName(
    //         `${attributes["http.method"]} ${attributes["http.url"]}`
    //       );
    //     }
    //     if (result.status && result.status > 299) {
    //       span.setStatus({ code: SpanStatusCode.ERROR });
    //     }
    //   },
    // }),
  ],
});

export function traceSpan<F extends (...args: any) => ReturnType<F>>(
  name: string,
  customContext: any,
  func: F,
) {
  let singleSpan: Span;
  const domain = new URL(window.location.href);
  const spanAttribute = customContext;
  spanAttribute.pageUrl = domain.pathname;
  spanAttribute.origin = domain.origin;
  spanAttribute.platform = window.navigator.userAgent;
  spanAttribute.device = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";
  // spanAttribute.someCustomKey = "some custom value";
  spanAttribute.fingerPrintVisitorId = localStorage.getItem("visitorId");
  if (bindingSpan) {
    const ctx = trace.setSpan(context.active(), bindingSpan);
    singleSpan = webTracerWithZone.startSpan(name, undefined, ctx);

    bindingSpan = undefined;
  } else {
    singleSpan = webTracerWithZone.startSpan(name);
  }
  singleSpan.setAttributes(spanAttribute);
  return null;
  // return context.with(trace.setSpan(context.active(), singleSpan), () => {
  //   const tempSingleSpan = singleSpan["spanContext"];
  //   const singleSpanSet:ISpan = {
  //     spanId: tempSingleSpan.spanId,
  //     traceFlags: tempSingleSpan.traceFlags,
  //     traceId: tempSingleSpan.traceId,
  //   };
  //   try {
  //     const result = func(singleSpanSet, localStorage.getItem("visitorId"));
  //     singleSpan.end();
  //     return result;
  //   } catch (error) {
  //     singleSpan.setStatus({ code: SpanStatusCode.ERROR });
  //     singleSpan.end();
  //     throw error;
  //   }
  // });
}
