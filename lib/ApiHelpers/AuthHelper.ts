import Env from "../Helpers/Env";
import { expect, request } from "@playwright/test";

const url = Env.URL || "https://automationintesting.online/";
let cookies;

export async function createCookies(username?: string, password?: string) {
  if (!username) {
    username = "admin";
  }
  if (!password) {
    password = "password";
  }

  const contextRequest = await request.newContext();
  const response = await contextRequest.post(url + "auth/login", {
    data: {
      username: username,
      password: password,
    },
  });

  expect(response.status()).toBe(200);
  const headers = response.headers();
  cookies = headers["set-cookie"].toString();
  return cookies;
}

export async function createToken(username?: string, password?: string) {
  if (!username) {
    username = "admin";
  }
  if (!password) {
    password = "password";
  }

  const contextRequest = await request.newContext();
  const response = await contextRequest.post(url + "auth/login", {
    data: {
      username: username,
      password: password,
    },
  });

  expect(response.status()).toBe(200);
  const headers = response.headers();
  const tokenString = headers["set-cookie"].split(";")[0];
  const token = tokenString.split("=")[1];
  return token;
}