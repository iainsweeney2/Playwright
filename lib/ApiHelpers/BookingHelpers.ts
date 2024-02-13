import { expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";
import Env  from "../Helpers/Env"
import { createHeaders } from "./CreateHeaders";

const url = Env.URL || "https://automationintesting.online/";
let bookingBody;
let checkOutArray;

export async function createRandomBookingBody(roomId: number, checkInString: string, checkOutString: string) {
  const bookingBody = {
    roomid: roomId,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    depositpaid: Math.random() < 0.5,
    email: faker.internet.email(),
    phone: faker.phone.number("###########"),
    bookingdates: {
      checkin: checkInString,
      checkout: checkOutString,
    },
  };
  return bookingBody;
}

export async function createFutureBooking(roomId: number) {
  let body;
  await expect(async () => {

    const futureCheckinDate = await futureOpenCheckinDate(roomId);
    const randBookingLength = faker.number.int({ min: 1, max: 4 });

    const checkInString = futureCheckinDate.toISOString().split("T")[0];
    //const checkOutString = stringDateByDays(futureCheckinDate, randBookingLength);

    // console.log("booking length: " + randBookingLength);
    // console.log("checkin string: " + checkInString);
    // console.log("checkout string: " + checkOutString);

    bookingBody = {
      roomid: roomId,
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      depositpaid: Math.random() < 0.5, //returns true or false
      email: faker.internet.email(),
      phone: faker.phone.number("###########"),
      bookingdates: {
        checkin: checkInString,
        //checkout: checkOutString,
      },
    };

    const createRequestContext = await request.newContext();
    const headersValue = await createHeaders();
    const response = await createRequestContext.post(url + "booking/", {headers: headersValue, data: bookingBody,});

    expect(response.status()).toBe(201);
    body = await response.json();
  }).toPass({
    intervals: [1_000, 2_000, 5_000],
    timeout: 20_000,
  });

  return body;
}


export async function getBookings(roomId: number) {

  const createRequestContext = await request.newContext();
  const headersValue = await createHeaders();
  const response = await createRequestContext.get(url + "booking/?roomid=" + roomId, {
    headers: headersValue,
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  // console.log(JSON.stringify(body));
  return body;
}


export async function getBookingSummary(bookingId: number) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(url + `booking/summary?roomid=${bookingId}`);

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body;
}

/**
 *
 * @param bookingId number for the booking you want to see the details of
 * @returns the body of the booking/${bookingId} endpoint
 */
export async function getBookingById(bookingId: number) {

  const createRequestContext = await request.newContext();
  const headersValue = await createHeaders();
  const response = await createRequestContext.get(url + `booking/${bookingId}`, {
    headers: headersValue,
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body;
}

export async function futureOpenCheckinDate(roomId: number) {
  const currentBookings = await getBookings(roomId);

  checkOutArray = [];

  for (let i = 0; i < (await currentBookings.bookings.length); i++) {
    const today = new Date();
    const checkOut = new Date(currentBookings.bookings[i].bookingdates.checkout);

    if (today < checkOut) {
      checkOutArray.push(checkOut);
    }
  }

  const mostFutureDate =
    checkOutArray
      .sort(function (a, b) {
        return a - b;
      })
      .pop() || new Date();

  // console.log("Last Checkout Date: " + mostFutureDate);
  return mostFutureDate;
}