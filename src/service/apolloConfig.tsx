import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { catchActivity } from "../lib/universal/utils/analytics";
const catchLoginActivity = (activityContent:any, userDetails:any, eventStatus:any) => {
  catchActivity({
    eventType: {
      activityName: activityContent,
      activityUrl: window.location.href,
    },
    eventBy: {
      userName: "anonymous",
    },
    eventStatus: eventStatus,
  });
};

const apolloConfig = () => {
  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("access_token")
          ? `Bearer ${localStorage.getItem("access_token")}`
          : "",
        "auth-strategy": "next",
        appid: "contact-orchestrator",
        realm: "Medigy",
      },
    });

    return forward(operation);
  });

  const mainLink: ApolloLink = new (createUploadLink as any)({
    uri:import.meta.env.VITE_POSTGRAPHILE_URL,
  });
    
  const anonymousLink: ApolloLink = new (createUploadLink as any)({
    uri:import.meta.env.VITE_POSTGRAPHILE_ANONYMOUS_URL
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError((errResp) => {
        console.log("errResp", errResp);
        if (errResp.graphQLErrors)
          errResp.graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        if (errResp.response) {
          console.log("response", errResp.response);
        }
        if (errResp.networkError) {
          // console.log(`[Network error]: ${errResp.networkError["statusCode"]}`);
          // if (errResp.networkError["statusCode"] === 401) {
          //   if (localStorage.getItem("refresh_token")) {
          //   } else {
          //     localStorage.clear();
          //     history.push("/login");
          //     return errResp.forward(errResp.operation);
          //   }
          // }
        }
      }),
      authMiddleware,
      mainLink,
      // ApolloLink.split(
      //   (operation) => operation.getContext().clientName === "forms",
      //   anonymousLink,
      //   mainLink
      // ),
    ]),
    cache: new InMemoryCache(),
    queryDeduplication: true,
  });

  return client;
};
export default apolloConfig;
