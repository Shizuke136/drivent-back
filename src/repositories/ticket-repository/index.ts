import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findManyTickets() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrrolmentId(id: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: id
    },
    include: {
      TicketType: true
    }
  });
}

async function insertTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) {
  return prisma.ticket.create({
    data: ticket
  });
}

async function findTicketsByTickedId(id: number) {
  return prisma.ticket.findFirst({
    where: {
      id: id
    }, include: {
      TicketType: true,
      Enrollment: true
    }
  });
}

const ticketRepository = { findManyTickets, findTicketByEnrrolmentId, insertTicket, findTicketsByTickedId };

export default ticketRepository;
