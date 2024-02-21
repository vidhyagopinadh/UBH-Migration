import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "proxy-polyfill";
import * as React from "react";
import ReactDOM from 'react-dom/client'
import App from "./App";
import { withApollo } from "react-apollo";
import { ApolloProvider } from "@apollo/react-hooks";
import apolloConfig from "./service/apolloConfig";
const client = apolloConfig();
const AppWithClient = withApollo(App);

// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <AppWithClient />
//     {/* <App /> */}
//   </ApolloProvider>,
//   document.getElementById("root"),
// );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    {/* <AppWithClient /> */}
    <App />
  </ApolloProvider>
)

