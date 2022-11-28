import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { Hotel } from "@prisma/client";

import hotelService from "@/services/hotel-service";
import httpStatus from "http-status";

export async function listHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;

  try {
    const hotels: Hotel[] = await hotelService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "ForbiddenError") return res.sendStatus(httpStatus.FORBIDDEN);
    else if (error.name === "UnauthorizedError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    else if (error.name === "InvalidDataError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    else return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function listRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params as Record<string, string>;
  const { userId } = req as AuthenticatedRequest;

  try {
    const hotelRooms = await hotelService.getRoomsByHotelId(hotelId, userId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    if (error.name === "ForbiddenError") return res.sendStatus(httpStatus.FORBIDDEN);
    else if (error.name === "InvalidDataError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    else if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    else return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
