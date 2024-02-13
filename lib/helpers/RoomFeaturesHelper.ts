import { faker } from "@faker-js/faker";

const roomFeatures = [
    "TV",
    "WiFi",
    "Safe",
    "Mini Bar",
    "Tea/Coffee",
    "Balcony",
    "Bath",
    "Shower",
    "Sea View",
    "Mountain View",
    "City View",
    "River View",
    "Garden View",
    "Pool View",
    "Patio",
    "Terrace",
    "Air Conditioning",
    "Heating",
    "Kitchen",
    "Dining Area",
    "Sofa",
    "Fireplace",
    "Private Entrance",
    "Soundproofing",
    "Wardrobe",
    "Clothes Rack",
    "Ironing Facilities",
    "Desk",
    "Seating Area",
    "Sofa Bed",
  ];
  
  export function allRoomFeatures():string[] {
    return roomFeatures;
  }
  
  export function randomRoomFeatures(): string {
    return roomFeatures[faker.number.int({ min: 0, max: roomFeatures.length - 1 })];
  }
  
  export function randomRoomFeaturesCount(count: number) {
    const features: string[] = [];
    const randomRoomFeature: string =  randomRoomFeatures()
    for (let i = 0; i < count; i++) {
      features.push(randomRoomFeature);
    }
    // This will remove all duplicates from the array
    return Array.from(new Set(features));
  }