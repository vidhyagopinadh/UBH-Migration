import jwt from "jsonwebtoken";
export function decodeJwt(token: string) {
  console.log(jwt)
  try {
    //const decodedToken = jwt.decode(token, { complete: true });
    // console.log(decodedToken)
    // if (decodedToken) {
    //   const payload = decodedToken.payload;
    //   return { payload };
    // } else {
    //   console.error("Failed to decode token.");
    //   return null;
    // }
  } catch (error) {
    console.error("Error decoding token:");
    return null;
  }
}
