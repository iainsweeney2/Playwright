import { createCookies } from "./AuthHelper";
import Env  from "../Helpers/Env"

const username = Env.ADMIN_NAME;
const password = Env.ADMIN_PASSWORD;

export async function createHeaders(token?: string) {

  let requestHeaders;
  if (token) {
    requestHeaders = {
      cookie: `token=${token}`,
    };
  } else {
    // Authenticate and get cookies
    const cookies = await createCookies(username, password);
    requestHeaders = {
      cookie: cookies,
    };
  }

  return requestHeaders;
}

export async function createInvalidHeaders() {
  const requestHeaders = {
    cookie: "cookie=invalid",
  };

  return requestHeaders;
}