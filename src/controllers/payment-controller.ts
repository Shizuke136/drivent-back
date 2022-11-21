import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";

import httpStatus from "http-status";
import paymentServices from "@/services/payment-service";

import { PaymentData } from "@/protocols";

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const paymentReq = req.body as PaymentData;
  const { userId } = req;

  if (!paymentReq.cardData || !paymentReq.ticketId) {
    return res.status(httpStatus.BAD_REQUEST).send({});
  }

  try {
    const payment = await paymentServices.createPayment(paymentReq, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    console.log(error);
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send({});
    } else if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
  }
}

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const { userId } = req;

  if(!ticketId) {
    return res.status(httpStatus.BAD_REQUEST).send();
  }

  try{
    const payment = await paymentServices.findPaymentTicket(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  }catch(error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send();
    } else if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send();
    }
  }
}
