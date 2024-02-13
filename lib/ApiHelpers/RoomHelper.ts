import { expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { randomRoomFeaturesCount } from "../helpers/RoomFeaturesHelper";
import Env  from "../Helpers/Env"
import { createHeaders } from "./CreateHeaders";

const url = Env.URL || "https://automationintesting.online/";

export async function createRandomRoomBody(roomName?: string, roomPrice?: number) {
  const roomType = ["Single", "Double", "Twin"];
  const features = randomRoomFeaturesCount(6);

  const roomBody = {
    roomName: roomName || faker.string.numeric(3),
    type: roomType[Math.floor(Math.random() * roomType.length)], // returns a random value from the array
    accessible: Math.random() < 0.5, //returns true or false
    image: faker.image.urlLoremFlickr({
      category: "cat",
      width: 500,
      height: 500,
    }),
    description: faker.hacker.phrase(),
    features: features.sort(() => 0.5 - Math.random()).slice(0, 3), // returns 3 random values from the array
    roomPrice: roomPrice || faker.string.numeric(3),
  };

  return roomBody;
}

export async function createRoom(roomName?: string, roomPrice?: number) {

  const roomBody = await createRandomRoomBody(roomName, roomPrice);

  const createRequestContext = await request.newContext();
  const headersValue = await createHeaders();
  const response = await createRequestContext.post(url + "room/", {
    headers: headersValue,
    data: roomBody,
  });

  expect(response.status()).toBe(201);
  const body = await response.json();

  return body;
}

export const defaultRoom = {
  roomid: 1,
  roomName: "101",
  type: "single",
  accessible: true,
  image: "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg",
  description:
    "Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.",
  features: ["TV", "WiFi", "Safe"],
  roomPrice: 100,
};
