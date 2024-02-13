// @ts-check
const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
const { DateTime } = require("luxon");

const randomFirstName = faker.person.firstName();
const randomLastName = faker.person.firstName();
const randomNumber = faker.random.numeric(4)
const currentDate = DateTime.now().toFormat('yyyy-MM-dd')
const currentDatePlusFive = DateTime.now().plus({ days: 5 }).toFormat('yyyy-MM-dd')


test('should be able to create a booking', async ({ request }) => {
    const response = await request.post("/booking", {
        data: {
            "firstname": randomFirstName,
            "lastname": randomLastName,
            "totalprice": randomNumber,
            "depositpaid": true,
            "bookingdates": {
                "checkin": currentDate,
                "checkout": currentDatePlusFive
            },
            "additionalneeds": "Breakfast"
        }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", randomFirstName);
    expect(responseBody.booking).toHaveProperty("lastname", randomLastName);
});

test('should be get all the booking details', async ({ request }) => {
    const response = await request.get("/booking");
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});

test('should be get specific booking details', async ({ request }) => {
    const response = await request.get('/booking/1');
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    });

    test('should be able to get subset of booking details using query parameters', async ({ request }) => {
        const response = await request.get('/booking', {
        params: {
        firstname: randomFirstName,
        lastname: randomLastName
        },
        });
        console.log(await response.json());
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        });