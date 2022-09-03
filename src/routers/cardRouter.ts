import { Router } from "express";
import * as cardController from "../controllers/cardController.js"

const cardRouter = Router();

cardRouter.post("/card/create", cardController.newCard)

export default cardRouter;