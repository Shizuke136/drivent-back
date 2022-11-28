import { Hotel } from "@prisma/client";
import { invalidDataError, notFoundError, unauthorizedError, forbiddenError } from "@/errors";

import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getUserEnrollmentId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollment) {
    throw unauthorizedError();
  }

  return enrollment.id;
}

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollmentId = await getUserEnrollmentId(userId);
  const ticket = await ticketRepository.findTicketByEnrrolmentId(enrollmentId);

  if(!ticket) {
    throw forbiddenError();
  }

  if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  if(ticket.status === "RESERVED") {
    throw invalidDataError(["Ticket is not PAID yet"]);
  }

  const hotels = await hotelRepository.getManyHotels();

  return hotels;
}

async function getRoomsByHotelId(hotelId: string, userId: number) {
  const enrollmentId = await getUserEnrollmentId(userId);
  const ticket = await ticketRepository.findTicketByEnrrolmentId(enrollmentId);

  if(!ticket) {
    throw forbiddenError();
  }

  if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  if(ticket.status === "RESERVED") {
    throw invalidDataError(["Ticket is not PAID yet"]);
  }

  if(!Number(hotelId)) {
    throw notFoundError(); 
  }

  const rooms = await hotelRepository.getRoomsFromHotelId(Number(hotelId));
  console.log(rooms);
  return rooms;
}

const hotelService = {
  getHotels, getRoomsByHotelId
};

export default hotelService;
