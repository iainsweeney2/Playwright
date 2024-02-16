import { test, expect } from "../../lib/fixtures/fixtures";
import { createRandomBookingBody, futureOpenCheckinDate } from '../../lib/ApiHelpers/BookingHelpers';
import { createInvalidHeaders, createHeaders } from '../../lib/ApiHelpers/CreateHeaders';
import { createRoom } from '../../lib/ApiHelpers/RoomHelper';
import { stringDateByDays } from '../../lib/helpers/date';

test.describe('Booking requests @booking', async () => {
    let requestBody;
    let roomId;
    let validHeaders;
    let invalidHeaders;

    test.beforeAll(async () => {
        validHeaders = await createHeaders();
        invalidHeaders = await createInvalidHeaders();
    })

    test.beforeEach(async () => {
        const room = await createRoom();
        const putRoom = await createRoom("Putroom", 99)
        roomId = room.roomid;

        const futureCheckinDate = await futureOpenCheckinDate(roomId);
        const checkInDateString = futureCheckinDate.toISOString().split("T")[0];
        const checkOutDateString = stringDateByDays(futureCheckinDate, 2);
        requestBody = await createRandomBookingBody(roomId, checkInDateString, checkOutDateString)
    });

    test("Create a new full booking @happy", async ({ request }) => {
        const response = await request.post("booking/", {
          data: requestBody,
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.bookingid).toBeGreaterThan(1);

        const booking = body.booking;
        expect(booking.bookingid).toBe(body.bookingid);
        expect(booking.roomid).toBe(requestBody.roomid);
        expect(booking.firstname).toBe(requestBody.firstname);
        expect(booking.lastname).toBe(requestBody.lastname);
        expect(booking.depositpaid).toBe(requestBody.depositpaid);

        const bookingdates = booking.bookingdates;
        expect(bookingdates.checkin).toBe(requestBody.bookingdates.checkin);
        expect(bookingdates.checkout).toBe(requestBody.bookingdates.checkout);
    });

    test("Room cannot be double booked @happy", async ({ request }) => {
        const response = await request.post("booking/", {
          data: requestBody,
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.bookingid).toBeGreaterThan(1);

        const booking = body.booking;
        expect(booking.bookingid).toBe(body.bookingid);
        expect(booking.roomid).toBe(requestBody.roomid);
        expect(booking.firstname).toBe(requestBody.firstname);
        expect(booking.lastname).toBe(requestBody.lastname);
        expect(booking.depositpaid).toBe(requestBody.depositpaid);

        const bookingdates = booking.bookingdates;
        expect(bookingdates.checkin).toBe(requestBody.bookingdates.checkin);
        expect(bookingdates.checkout).toBe(requestBody.bookingdates.checkout);

        const newRresponse = await request.post("booking/", {
            data: requestBody,
          });
          expect(newRresponse.status()).toBe(409);
    });

    test("Get a booking with a specific room Id", async ({ request }) => {
      const response = await request.get("booking/summary?roomid=1");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.bookings.length).toBeGreaterThanOrEqual(1);

      expect(body.bookings[0].bookingDates.checkin).toBeValidDate();
      expect(body.bookings[0].bookingDates.checkout).toBeValidDate();
    })

    test("Get a booking with a specific room Id that doesn't exist", async ({ request }) => {
      const response = await request.get("booking/summary?roomid=99999");
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.bookings.length).toBe(0);
    })

    test("Get a booking with a specific room id that is empty", async ({ request }) => {
      const response = await request.get("booking/summary?roomid=");
  
      expect(response.status()).toBe(500);
  
      const body = await response.json();
      expect(body.timestamp).toBeValidDate();
      expect(body.status).toBe(500);
      expect(body.error).toBe("Internal Server Error");
      expect(body.path).toBe("/booking/summary");
    });

    test("Get all bookings with details @happy", async ({ request }) => {
      const response = await request.get("booking/", {
        headers: validHeaders,
      });
  
      expect(response.status()).toBe(200);
  
      const body = await response.json();
      expect(body.bookings.length).toBeGreaterThanOrEqual(1);
      expect(body.bookings[0].bookingid).toBe(1);
      expect(body.bookings[0].roomid).toBe(1);
      expect(body.bookings[0].firstname).toBe("James");
      expect(body.bookings[0].lastname).toBe("Dean");
      expect(body.bookings[0].depositpaid).toBe(true);
      expect(body.bookings[0].bookingdates.checkin).toBeValidDate();
      expect(body.bookings[0].bookingdates.checkout).toBeValidDate();
    });

    test("Get all bookings without authentication", async ({ request }) => {
      const response = await request.get("booking/", {
        headers: invalidHeaders,
      });

      expect(response.status()).toBe(403);
      const body = await response.text();
      expect(body).toBe("");
    })

    test("GET booking by id with details", async ({ request }) => {
      const response = await request.get("booking/1", {
        headers: validHeaders,
      });
  
      expect(response.status()).toBe(200);
  
      const body = await response.json();
      expect(body.bookingid).toBe(1);
      expect(body.roomid).toBe(1);
      expect(body.firstname).toBe("James");
      expect(body.lastname).toBe("Dean");
      expect(body.depositpaid).toBe(true);
      expect(body.bookingdates.checkin).toBeValidDate();
      expect(body.bookingdates.checkout).toBeValidDate();
    });

    test("GET booking by id that doesn't exist", async ({ request }) => {
      const response = await request.get("booking/999999", {
        headers: validHeaders,
      });
  
      expect(response.status()).toBe(404);
  
      const body = await response.text();
      expect(body).toBe("");
    });
  
    test("GET booking by id without authentication", async ({ request }) => {
      const response = await request.get("booking/1");
  
      expect(response.status()).toBe(403);
  
      const body = await response.text();
      expect(body).toBe("");
    });

    test("")
})
