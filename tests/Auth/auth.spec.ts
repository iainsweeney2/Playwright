import env from "../../lib/Helpers/Env";
import { faker } from "@faker-js/faker";
const { test, expect } = require('@playwright/test');

test.describe("Authentication requests @auth", async () => {
    const username = env.ADMIN_NAME;
    const password = env.ADMIN_PASSWORD;

    test("POST Login with valid credentials @happy", async ({ request }) => {
        const startTime = Date.now();
        const response = await request.post(env.URL + 'auth/login' , {
            data : {
                username : username,
                password : password,
            },
        });

        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(1000);
        expect(response.status()).toBe(200);

        const body = await response.text();
        expect(body).toBe("");
        expect(response.headers()["set-cookie"]).toContain("token=")
    })

    test("POST Login with invalid credentials @unhappy", async ({ request }) => {
        const startTime = Date.now();
        const response = await request.post(env.URL + 'auth/login' , {
            data : {
                username : `${faker.string.alphanumeric(5)}`,
                password : `${faker.string.alphanumeric(5)}`,
            },
        });

        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(1000);
        expect(response.status()).toBe(403);

        const body = await response.text();
        expect(body).toBe("");
        expect(response.headers()["set-cookie"]).toBeFalsy();
    })
})