import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";
import * as schema from "../schema/cardSchema.js";
import { ErrorInfo } from "../middlewares/errorHandlingMiddleware.js"


export async function newCard(req:Request, res:Response){
    const { apiKey } = res.locals;

    const { userId, type } : { userId:number, type:TransactionTypes } = req.body;
    const validation = schema.createCard.validate({userId, type}, {abortEarly: false})
    if(validation.error) throw new ErrorInfo("error_unprocessable_entity", validation.error.message);

    await cardService.createCard(apiKey, userId, type);
    res.sendStatus(201);
};

export async function activation(req:Request, res:Response){
    const { apiKey } = res.locals
    const { cardId } = req.params;
    const { userId, password, CVC } : { userId: number, password: string, CVC:string } = req.body;

    const validation = schema.cardActivation.validate({userId, password, CVC}, {abortEarly: false})
    if(validation.error) throw new ErrorInfo("error_unprocessable_entity", validation.error.message);
    if(!cardId) throw new ErrorInfo("error_unprocessable_entity", "Invalid cardId");
    console.log("Oi")
    await cardService.cardActivation(apiKey,Number(cardId), userId, password, CVC);
    res.sendStatus(200)
};

export async function toggleCardStatus(req:Request, res:Response){
    const { apiKey } = res.locals;
    const { cardId } = req.query;
    const { userId, password, toBlock } : { userId: number, password: string, toBlock:boolean }  = req.body;

    const validation = schema.toggleCardStatus.validate({userId, password, toBlock}, {abortEarly: false})
    if(validation.error) throw new ErrorInfo("error_unprocessable_entity", validation.error.message);

    if(!cardId) throw new ErrorInfo("error_unprocessable_entity", "Invalid cardId");

    await cardService.toggleBlockedCard(apiKey,Number(cardId), userId, password, toBlock)
};

export async function balance(req:Request, res:Response){
    const { apiKey } = res.locals;
    const { cardId, userId } = req.query;

    if(!cardId || !userId) throw new ErrorInfo("error_unprocessable_entity", "Invalid Ids");

    const balance : any = await cardService.balance(apiKey, Number(cardId), Number(userId));

    res.status(200).send(balance);
};

export async function recharge(req:Request, res:Response){
    const { apiKey } = res.locals;
    const { cardId } = req.query;
    const { amount } : {amount:number} = req.body;

    const validation = schema.cardBalance.validate({amount});
    if(validation.error) throw new ErrorInfo("error_unprocessable_entity", "validation.error.message");

    if(!cardId) throw new ErrorInfo("error_unprocessable_entity", "Invalid cardId");

    await cardService.recharge(apiKey, Number(cardId), amount);

    res.sendStatus(201);
};

export async function transaction(req:Request, res:Response){
    const { cardId, password, businessId, amount } : { cardId:number, password:string, businessId:number, amount:number} = req.body;

    const validation = schema.transaction.validate({cardId, password, businessId, amount}, {abortEarly: false});
    if(validation.error) throw new ErrorInfo("error_unprocessable_entity", "validation.error.message");


    await cardService.transaction(cardId, password, businessId, amount);

    res.sendStatus(201);
}
