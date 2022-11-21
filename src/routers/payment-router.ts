import { Router } from "express";
import { postPayment, getPayment } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const paymentRouter = Router();

paymentRouter
  .all("/*", authenticateToken)
  .get("/", getPayment)
  .post("/process", postPayment);
  
export { paymentRouter };
