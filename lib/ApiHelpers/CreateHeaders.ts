import { createCookies } from "./AuthHelper";

const username = "admin";
const password = "password";

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