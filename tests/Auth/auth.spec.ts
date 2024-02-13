import Env from "../../lib/Helpers/Env";
import { faker } from "@faker-js/faker";
const { test, expect } = require('@playwright/test');

test.describe("Authentication requests @auth", async () => {
    const username = Env.ADMIN_NAME;
    const password = Env.ADMIN_PASSWORD;

    test("POST Login with valid credentials @happy", async ({ request }) => {
        const startTime = Date.now();
        const response = await request.post(Env.URL + 'auth/login' , {
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
        const response = await request.post(Env.URL + 'auth/login' , {
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