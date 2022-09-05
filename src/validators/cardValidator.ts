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

export async function employeeCard(cardId:number, employeeId:number ) {
    const card : cardRepository.Card = await cardRepository.findById(Number(cardId));
    if(card.employeeId !== employeeId) throw Error("That card don't belong to u!");
    return card
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

export async function isActive(password:string){
    if(password) throw Error("This card is already active");
};
export async function cardActive(password:string){
    if(!password) throw Error("This card isn't active");
}

export async function passwordSize(password:string){
    if(password.length !== 4) throw Error("That password is invalid");
};
//I don't know a better name
export async function status(isBlocked:boolean, toBlock:boolean){
    if(isBlocked === toBlock) throw Error(`Already ${isBlocked ? "blocked" : "unblocked"}`);
};

export async function confirmPassword(cardPassword:string, password:string){
    const decryptedPassword : string = cryptr.decrypt(cardPassword);
    if(decryptedPassword !== password) throw Error("Wrong card data");
};

export async function registered(cardId:number){
    const card : cardRepository.Card = await cardRepository.findById(cardId);
    if(!card) throw Error("This card doesn't exist");
    return card
};