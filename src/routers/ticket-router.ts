import { Router } from "express";
import { getAllTicketTypes, getUserTickets, createTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const ticketRouter = Router();

ticketRouter
  .all("/*", authenticateToken)
  .get("/types", getAllTicketTypes)
  .post("/", createTicket)
  .get("/", getUserTickets);

export { ticketRouter };
