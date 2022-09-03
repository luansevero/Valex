import { Request, Response } from "express";
import * as cardService from "../services/cardService.js"

export async function newCard(req:Request, res:Response){
    const apiKey : any = req.headers["x-api-key"];
    const { userId, type } : { userId:number, type:string } = req.body.type;
    if(!apiKey || !userId || !type) return res.sendStatus(422);

    await cardService.createCard();
    res.sendStatus(201);
};