import QueryString from "qs";
import Cryptr from "cryptr";
import dayjs from 'dayjs';
import dotenv from "dotenv";
import * as cardRepository from "../repositories/cardRepository.js";

dotenv.config();

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

export async function type(cardType:any, employeeId:number){
    const employeerCardboard : cardRepository.Card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(employeerCardboard) throw Error("Already have that type of card!");
};

export async function employeeCard(cardId:string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[], employeeId:number ) {
    const card : cardRepository.Card = await cardRepository.findById(Number(cardId));
    if(card.employeeId !== employeeId) throw Error("That card don't belong to u!");
};

export async function expiration(expirationDate: string){
    const actualDate : any = dayjs().format("MM-YYYY");
    const expiration : any = dayjs(expirationDate).format("MM-YYYY");
    if(expiration.diff(actualDate, 'month') <= 0) throw Error("That card is expired");
};

export async function securityCode(securityCode:string, CVC:string){
    const decryptedSecurityCode : string = cryptr.decrypt(securityCode);
    if(decryptedSecurityCode !== CVC) throw Error("Wrong card data");
};