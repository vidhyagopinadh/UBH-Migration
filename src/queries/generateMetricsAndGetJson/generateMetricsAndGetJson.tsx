import gql from "graphql-tag";

export default gql`
  mutation generateMetricsAndGetJson($input: GenerateMetricsAndGetJsonInput!) {
    generateMetricsAndGetJson(input: $input) {
      json
    }
  }
`;
