import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findOnePaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      id: ticketId
    }
  });
}

async function postOnePayment(paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">) {
  return prisma.payment.create({
    data: paymentData,
  });
}

async function updatePaymentStatus(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId
    }, data: {
      status: "PAID"
    }
  });  
}

const paymentRepository = { findOnePaymentByTicketId, postOnePayment, updatePaymentStatus };

export default paymentRepository;
