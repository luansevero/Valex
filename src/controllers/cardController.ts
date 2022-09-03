import { Request, Response } from "express";
import * as cardService from "../services/cardService.js"

export async function newCard(req:Request, res:Response){
    const { apiKey } : { apiKey: string } = res.locals.apiKey
    const { userId, type } : { userId:number, type:string } = req.body;
    if(!userId || !type) return res.sendStatus(422);

    await cardService.createCard(apiKey, userId, type);
    res.sendStatus(201);
};