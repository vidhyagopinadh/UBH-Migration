import pgDataProvider from "ra-postgraphile";
import apolloConfig from "./service/apolloConfig";
import introspection from "./__generated__/introspection.json";
const client = apolloConfig();
const modifiedIntrospection = {
  introspection: {
    schema: JSON.parse(JSON.stringify(introspection)).__schema,
  },
};

const config = {
  primaryKey: {
    requestViews: "nodeId",
  },
};

export const DataProviderConfig = () => {
  const fetchDataProvider = async () => {
    return await pgDataProvider(client, undefined, modifiedIntrospection);
  };
  return fetchDataProvider();
};
