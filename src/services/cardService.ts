import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from 'dayjs';
import QueryString from "qs";

import { TransactionTypes } from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

import validateCompany from "../validators/companyValidator.js";
import * as employeeValidator from "../validators/employeeValidator.js";
import * as cardValidator from "../validators/cardValidator.js";




const cryptr = new Cryptr(process.env.CRYPTR_KEY);

// Services
// #Create Card Service
export async function createCard(apiKey:string, employeeId:number, type:TransactionTypes){
    await validateCompany(apiKey);

    const employee : employeeRepository.Employee = await employeeValidator.employee(employeeId);

    await cardValidator.type(type, employeeId);

    await generateCard(employee["fullName"], employeeId, type);
};
    //Generate Card
    function employeeCardName(employeeFullName:string){
        const employeeCardName : string[] = employeeFullName.split(" ");
        if(employeeCardName.length > 2){
            return  employeeCardName
                    .filter(name => name[0].length > 3 && name[0] === name[0].toUpperCase())
                    .map((name, index, array) => index!==0 || index !== array.length - 1 ? name[0] : name)
                    .join(" ")
        };
        return  employeeFullName
    }
    function generateSecurityCode(){
        const securityCode : string = faker.finance.creditCardCVV();
        const encryptSecuritCode : string = cryptr.encrypt(securityCode);
        return encryptSecuritCode
    }
    async function generateCard(employeeFullName:string, employeeId:number, type:TransactionTypes){
        const number : string = faker.finance.creditCardNumber('visa');
        const cardholderName : string = employeeCardName(employeeFullName);
        const securityCode : string = generateSecurityCode();
        const expirationDate : string = dayjs().add(5, "year").format("MM/YYYY");

        await cardRepository.insert({
            employeeId,
            number,
            cardholderName,
            securityCode,
            expirationDate,
            isVirtual:false,
            isBlocked:true,
            type
        });
    }
// //#Card activation service
// export async function cardActivation(apiKey:string, cardId: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[], employeeId:number, password:string, CVC:string){
//     await validateCompany(apiKey);

//     await validateEmployee(employeeId);

//     const card : cardRepository.Card = await validateEmployeeCard(cardId, employeeId);

//     validateCardExpiration(card["expirationDate"]);

//     validateCardSecurityCode(card["securityCode"], CVC);

//     await generateCardPassword();

// }
//     //Generate Card Password
//     // async function generateCardPassword(){

//     // }


// //Validations

// //Validations - Activation





