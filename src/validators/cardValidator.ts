import Cryptr from "cryptr";
import dayjs from 'dayjs';
import dotenv from "dotenv";
import * as cardRepository from "../repositories/cardRepository.js";
import { ErrorInfo } from "../middlewares/errorHandlingMiddleware.js"

dotenv.config();

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

export async function type(cardType:any, employeeId:number){
    const employeerCardboard : cardRepository.Card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(employeerCardboard) throw new ErrorInfo("error_conflict", "Already have that type of card!");
};

export async function employeeCard(cardId:number, employeeId:number ) {
    const card : cardRepository.Card = await cardRepository.findById(cardId);
    if(!card) throw new ErrorInfo("error_unauthorized", "That card don't exist");
    if(card.employeeId !== employeeId) throw new ErrorInfo("error_unauthorized", "That card don't belong to u!");
        
    return card
};

export function expiration(expirationDate: string){
    const actualDate : string = dayjs().format("MM-YYYY");
    const expiration = expirationDate;
    if(dayjs(expiration).diff(actualDate, 'month') <= 0) throw new ErrorInfo("error_unauthorized","That card is expired");
};

export function securityCode(securityCode:string, CVC:string){
    const decryptedSecurityCode : string = cryptr.decrypt(securityCode);
    if(decryptedSecurityCode !== CVC) throw new ErrorInfo("error_unauthorized", "Wrong card data")
};

export function isActive(password:string){
    if(password.length > 0) throw new ErrorInfo("error_unauthorized", "This card is already active");
};
export function cardActive(password:string){
    if(!password) throw new ErrorInfo("error_unauthorized", "This card isn't active");
}

export function passwordSize(password:string){
    if(password.length !== 4) throw new ErrorInfo("error_unauthorized", "That password is invalid");
};
//I don't know a better name
export function status(isBlocked:boolean, toBlock:boolean){
    if(isBlocked === toBlock) throw new ErrorInfo("error_unauthorized", `Already ${isBlocked ? "blocked" : "unblocked"}`);
};

export function confirmPassword(cardPassword:string, password:string){
    const decryptedPassword : string = cryptr.decrypt(cardPassword);
    if(decryptedPassword !== password) throw new ErrorInfo("error_unauthorized","Wrong card data");
};

export async function registered(cardId:number){
    const card : cardRepository.Card = await cardRepository.findById(cardId);
    if(!card) throw new ErrorInfo("error_conflict", "This card doesn't exist");
    return card
};