import { Router } from "express";
import verifyApiKey from "../middlewares/verifyApiKey.js"
import * as cardController from "../controllers/cardController.js"

const companyRouter = Router();

companyRouter.post("/employee/recharge/:cardId", verifyApiKey, cardController.recharge);

export default companyRouter;