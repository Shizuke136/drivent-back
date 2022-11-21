import { PaymentData } from "../../protocols";
import { Payment } from "@prisma/client";

import ticketRepository from "@/repositories/ticket-repository";
import paymentRepository from "@/repositories/payment-repository";

import { notFoundError, unauthorizedError } from "@/errors";

async function findPaymentTicket(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findTicketsByTickedId(ticketId);

  if(!ticket) {
    throw notFoundError();
  }

  if(ticket.Enrollment.userId !== userId) { //Para o caso do ticket não coincidir com o usuário
    throw unauthorizedError();
  }

  return await paymentRepository.findOnePaymentByTicketId(ticketId);
}

async function createPayment(data: PaymentData, userId: number) {
  const userTicket = await ticketRepository.findTicketsByTickedId(data.ticketId);

  if(!userTicket) {
    throw notFoundError();
  }

  if(userTicket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  const cardNumber: string = data.cardData.number.toString();
  const cardLastDigits: string = cardNumber.slice(-4);

  const paymentFinalData: Omit<Payment, "id" | "createdAt" | "updatedAt"> =
    {
      ticketId: data.ticketId,
      value: userTicket.TicketType.price,
      cardIssuer: data.cardData.issuer,
      cardLastDigits: cardLastDigits,
    };

  const insertOnePayment = await paymentRepository.postOnePayment(paymentFinalData);
  const updatePayment = await paymentRepository.updatePaymentStatus(data.ticketId);

  return insertOnePayment;
}

const paymentServices = { findPaymentTicket, createPayment };

export default paymentServices;
