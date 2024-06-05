import { AuthorizationCode } from "simple-oauth2";
import { env } from "./env";

export const googleClient = new AuthorizationCode({
  client: {
    id: env.GOOGLE_CLIENT_ID,
    secret: env.GOOGLE_CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://oauth2.googleapis.com",
    tokenPath: "/token",
    authorizePath: "https://accounts.google.com/o/oauth2/v2/auth",
  },
});
