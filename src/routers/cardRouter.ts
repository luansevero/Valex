import { Router } from "express";
import verifyApiKey from "../middlewares/verifyApiKey.js"
import * as cardController from "../controllers/cardController.js"

const cardRouter = Router();

cardRouter.post("/card/create", verifyApiKey, cardController.newCard)

export default cardRouter;