import { Router } from "express";
import verifyApiKey from "../middlewares/verifyApiKey.js"
import * as cardController from "../controllers/cardController.js"

const cardRouter = Router();

cardRouter.post("/card/create", verifyApiKey, cardController.newCard);
cardRouter.post("/card/active/:cardId", verifyApiKey, cardController.activation);
cardRouter.post("/card/status/:cardId", verifyApiKey, cardController.toggleCardStatus);
cardRouter.get("/card/balance/:cardId/:userId", verifyApiKey, cardController.balance);
cardRouter.post("/card/transaction", cardController.transaction);

export default cardRouter;