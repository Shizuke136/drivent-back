import { prisma } from "@/config";

async function getManyHotels() {
  return prisma.hotel.findMany();
}

async function getRoomsFromHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },

    include: {
      Rooms: true
    }
  });
}

const hotelRepository = {
  getManyHotels, getRoomsFromHotelId
};

export default hotelRepository;
