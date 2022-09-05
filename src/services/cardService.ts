import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from 'dayjs';
import dotenv from "dotenv";

import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { cardBalance } from "../repositories/cardBalanceRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

import validateCompany from "../validators/companyValidator.js";
import * as employeeValidator from "../validators/employeeValidator.js";
import * as cardValidator from "../validators/cardValidator.js";
import * as businessValidator from "../validators/businessValidator.js";


dotenv.config();

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

// Services
// #Create Card Service
export async function createCard(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    console.log("Oi")
    await validateCompany(apiKey);
    const employee: employeeRepository.Employee = await employeeValidator.employee(employeeId);

    await cardValidator.type(type, employeeId);

    await generateCard(employee["fullName"], employeeId, type);
};
function employeeCardName(employeeFullName: string) {
    const employeeCardName: string[] = employeeFullName.split(" ");
    if (employeeCardName.length > 2) {
        return employeeCardName
            .filter(name => name[0].length > 3 && name[0] === name[0].toUpperCase())
            .map((name, index, array) => index !== 0 || index !== array.length - 1 ? name[0] : name)
            .join(" ")
    };
    return employeeFullName
}
function generateSecurityCode() {
    const securityCode: string = faker.finance.creditCardCVV();
    const encryptSecuritCode: string = cryptr.encrypt(securityCode);
    return encryptSecuritCode
}
async function generateCard(employeeFullName: string, employeeId: number, type: cardRepository.TransactionTypes) {
    const number: string = faker.finance.creditCardNumber('visa');
    const cardholderName: string = employeeCardName(employeeFullName);
    const securityCode: string = generateSecurityCode();
    const expirationDate: string = dayjs().add(5, "year").format("MM/YYYY");

    await cardRepository.insert({
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: true,
        type
    });
};
//#Card activation service
export async function cardActivation(apiKey: string, cardId: number, employeeId: number, password: string, CVC: string) {
    await validateCompany(apiKey);

    await employeeValidator.employee(employeeId);

    const card: cardRepository.Card = await cardValidator.employeeCard(cardId, employeeId);

    cardValidator.expiration(card["expirationDate"]);

    cardValidator.isActive(card["password"]);

    cardValidator.securityCode(card["securityCode"], CVC);

    cardValidator.passwordSize(password);

    await generateCardPassword(card["id"], password);

};
//Generate Card Password
async function generateCardPassword(cardId: number, password: string) {
    const encryptPassword: string = cryptr.encrypt(password);
    await cardRepository.update(cardId, { password: encryptPassword });
};

//Block Card && Unblock Card
export async function toggleBlockedCard(apiKey: string, cardId:number, employeeId: number, password: string, toBlock:boolean){
    await validateCompany(apiKey);

    await employeeValidator.employee(employeeId);

    const card: cardRepository.Card = await cardValidator.employeeCard(cardId, employeeId);

    cardValidator.expiration(card["expirationDate"]);

    cardValidator.status(card["isBlocked"], toBlock);

    cardValidator.confirmPassword(card["password"], password);

    await toggleCardStatus(Number(cardId), toBlock)
}
async function toggleCardStatus(cardId:number, toBlock:boolean){
    await cardRepository.update(cardId, {isBlocked: toBlock})
}

//Transactions & Balance
export async function balance(apiKey:string, cardId:number , employeeId: number){
    await validateCompany(apiKey);

    await employeeValidator.employee(employeeId);

    return await cardBalance(cardId);
}

//Recharge
export async function recharge(apiKey:string, cardId:number, amount:number){
    await validateCompany(apiKey);

    const card : cardRepository.Card = await cardValidator.registered(cardId);

    await cardValidator.cardActive(card["password"]);

    await cardValidator.expiration(card["expirationDate"]);
    
    await rechargeRepository.insert({cardId, amount});
}

//Transactions
export async function transaction(cardId:number, password:string, businessId:number, amount:number){
    
    const card : cardRepository.Card = await cardValidator.registered(cardId);

    await cardValidator.cardActive(card["password"]);

    await cardValidator.expiration(card["expirationDate"]);

    if(card["isBlocked"]) throw Error(`That card is blocked`);

    await cardValidator.confirmPassword(card["password"], password);

    const businessType : cardRepository.TransactionTypes = await businessValidator.registered(businessId);

    if(businessType !== card["type"]) throw Error("Not the same type");
    
    
}