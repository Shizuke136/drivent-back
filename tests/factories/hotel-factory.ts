import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel() {
  const testHotel = prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.internet.url(),
      updatedAt: new Date()
    }
  });

  return testHotel;
}

export async function createRoom(hotelId: number) {
  const testRoom = prisma.room.create({
    data: {
      hotelId,
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      updatedAt: new Date()
    }
  });

  return testRoom;
}
