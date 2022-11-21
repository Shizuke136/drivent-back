import { Response } from "express";
import { AuthenticatedRequest, authenticateToken } from "@/middlewares";

import httpStatus from "http-status";
import ticketService from "@/services/ticket-services";

export async function getAllTicketTypes(req: AuthenticatedRequest, res: Response) {
  try{
    const AllTicketTypes = await ticketService.listManyTicketType();
    return res.status(httpStatus.OK).send(AllTicketTypes);
  } catch(error) {
    console.log(error);
    return res.status(httpStatus.NO_CONTENT).send({});
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try{
    const userTickets = await ticketService.getUserTickets(userId);
    return res
      .status(httpStatus.OK)
      .send(userTickets);
  }catch(error) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({});
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketTypeId: number = req.body.ticketTypeId;

  if(!ticketTypeId) {
    return res.status(httpStatus.BAD_REQUEST).send({});
  }

  try {
    const userTicket = await ticketService.saveTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(userTicket);
  }catch(error) {
    console.log(error);
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
