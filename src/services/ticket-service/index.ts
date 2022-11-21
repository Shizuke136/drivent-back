import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

import { Ticket } from "@prisma/client";
import { TicketType } from "@/protocols";
import { notFoundError } from "@/errors";

async function listManyTicketType(): Promise<TicketType[]> {
  return await ticketRepository.findManyTickets();
}

async function getUserTickets(userId: number) {
  const enrollmentId = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollmentId) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrrolmentId(enrollmentId.id);

  if(!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function saveTicket(userId: number, ticketTypeId: number) {
  const enrollmentId = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollmentId.id) {
    throw notFoundError();
  }

  const saveTicket: Omit<Ticket, "id" | "createdAt" | "updatedAt"> = {
    status: "RESERVED",
    ticketTypeId,
    enrollmentId: enrollmentId.id
  };

  await ticketRepository.insertTicket(saveTicket);

  return await ticketRepository.findTicketByEnrrolmentId(enrollmentId.id);
}

const ticketService = { getUserTickets, saveTicket, listManyTicketType };

export default ticketService;
