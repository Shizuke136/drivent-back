import { listHotels, listRoomsByHotelId } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", listHotels)
  .get("/:hotelId", listRoomsByHotelId);

export { hotelsRouter };
