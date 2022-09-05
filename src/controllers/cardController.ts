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

    await cardService.cardActivation(apiKey,cardId, userId, password, CVC);
    res.sendStatus(200)
};

export async function toggleCardStatus(req:Request, res:Response){
    const { apiKey } = res.locals;
    const { cardId } = req.query;
    const { userId, password, toBlock } : { userId: number, password: string, toBlock:boolean }  = req.body;
    if(!cardId || !userId || !password ) return res.sendStatus(422);

    await cardService.toggleBlockedCard(apiKey,cardId, userId, password, toBlock)
}