import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "proxy-polyfill";
import * as React from "react";
import ReactDOM from 'react-dom/client'
import App from "./App";



ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>
)
// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <AppWithClient />
//     {/* <App /> */}
//   </ApolloProvider>,
//   document.getElementById("root"),
// );

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <ApolloProvider client={client}>
//     {/* <AppWithClient /> */}
//     <App />
//   </ApolloProvider>
// )

