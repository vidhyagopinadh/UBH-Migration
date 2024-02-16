import React from "react";
import { Helmet } from "react-helmet";

const GoogleAnalytics: React.FC = () => {
  return (
    <Helmet>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=%import.meta.env.VITE_GA_MEASUREMENT_ID%`}
      />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            dataLayer.push(arguments);
          }

          gtag('js', new Date());
          gtag('config', '%import.meta.env.VITE_GA_MEASUREMENT_ID%');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
