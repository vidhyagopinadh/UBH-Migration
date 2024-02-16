interface IHeader {
  anonymous: boolean;
  authHeader: string;
}

interface IFetchConfig {
  anonymous: boolean;
  method?: string;
  query: string;
  variables?: any;
}

interface IFetchConfigReturn {
  status: number;
  data?: any;
  error?: any;
}
const Header = ({ anonymous, authHeader }: IHeader) => {
  const minimal = {
    "Content-Type": "application/json",
    Accept: "application/json",
    appid: "contact-orchestrator",
    realm: "Medigy",
    "auth-strategy": "next",
  };
  return anonymous
    ? minimal
    : { ...minimal, Authorization: `Bearer ${authHeader}` };
};

async function FetchConfig({
  anonymous,
  method = "POST",
  query,
  variables = {},
}: IFetchConfig): Promise<IFetchConfigReturn> {
  return await new Promise((resolve, reject) => {
    const authHeader = String(localStorage.getItem("access_token"));
    const url = anonymous
      ? import.meta.env.VITE_POSTGRAPHILE_URL
      : import.meta.env.VITE_POSTGRAPHILE_ANONYMOUS_URL

    fetch(url+"", {
      method: method,
      headers: Header({ anonymous, authHeader }),
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        resolve({ status: 200, data: data.data, error: data.errors || [] });
      })
      .catch((error) => {
        console.log("error fetch", error);
        reject({ status: 400, error });
      });
  });
}

export default FetchConfig;
