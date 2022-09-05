import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js"


export async function newCard(req:Request, res:Response){
    const { apiKey } = res.locals;

    const { userId, type } : { userId:number, type:TransactionTypes } = req.body;
    if(!userId || !type) return res.sendStatus(422);

    await cardService.createCard(apiKey, userId, type);
    res.sendStatus(201);
};

export async function activation(req:Request, res:Response){
    const { apiKey } = res.locals
    const { cardId } = req.query;
    const { userId, password, CVC } : { userId: number, password: string, CVC:string } = req.body;
    if(!cardId || !userId || !password || !CVC) return res.sendStatus(422);

    await cardService.cardActivation(apiKey,Number(cardId), userId, password, CVC);
    res.sendStatus(200)
};

export async function toggleCardStatus(req:Request, res:Response){
    const { apiKey } = res.locals;
    const { cardId } = req.query;
    const { userId, password, toBlock } : { userId: number, password: string, toBlock:boolean }  = req.body;
    if(!cardId || !userId || !password ) return res.sendStatus(422);

    await cardService.toggleBlockedCard(apiKey,Number(cardId), userId, password, toBlock)
};

export async function balance(req:Request, res:Response){
    const { apiKey } = res.locals;
    const { cardId, userId } = req.query;
    if(!cardId || !userId) return res.sendStatus(422);

    const balance : any = await cardService.balance(apiKey, Number(cardId), Number(userId));

    res.status(200).send(balance);
};

export async function recharge(req:Request, res:Response){
    const { apiKey } = res.locals;
    const { cardId } = req.query;
    const { amount } : {amount:number} = req.body;
    if(!amount || amount <= 0 ) return res.sendStatus(422);

    await cardService.recharge(apiKey, Number(cardId), amount);

    res.sendStatus(201);
};

export async function transaction(req:Request, res:Response){
    const { cardId, password, businessId, amount } : { cardId:number, password:string, businessId:number, amount:number} = req.body;
    if(!cardId || !password || !businessId || !amount || amount <= 0) res.sendStatus(422);

    await cardService.transaction(cardId, password businessId, amount);

    res.sendStatus(201);
}
