const { test, expect } = require('@playwright/test');
import { createRandomBookingBody, futureOpenCheckinDate } from '../../lib/ApiHelpers/BookingHelpers';
import { createRoom } from '../../lib/ApiHelpers/RoomHelper';
import { stringDateByDays } from '../../lib/helpers/date';

test.describe('Booking requests @booking', async () => {
    let requestBody;
    let roomId;

    test.beforeEach(async () => {
        const room = await createRoom();
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
})
