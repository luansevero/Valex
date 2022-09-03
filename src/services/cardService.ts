import { TransactionTypes } from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from 'dayjs';
import QueryString from "qs";

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

//Services
//#Create Card Service
export async function createCard(apiKey:string, employeeId:number, type:TransactionTypes){
    await validateCompany(apiKey);

    const employee : employeeRepository.Employee = await validateEmployee(employeeId);

    await validateEmployeeNewCardType(type, employeeId);

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
//#Card activation service
export async function cardActivation(apiKey:string, cardId: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[], employeeId:number, password:string, CVC:string){
    await validateCompany(apiKey);

    await validateEmployee(employeeId);

    const card : cardRepository.Card = await validateEmployeeCard(cardId, employeeId);

    validateCardExpiration(card["expirationDate"]);

    validateCardSecurityCode(card["securityCode"], CVC);

    await generateCardPassword();

}
    //Generate Card Password
    async function generateCardPassword()


//Validations
async function validateCompany(apiKey: string){
    const company : companyRepository.Company = await companyRepository.findByApiKey(apiKey);
    if(!company) throw Error("That key don't belong to any company!");
};
async function validateEmployee(employeeId:number){
    const employee : employeeRepository.Employee = await employeeRepository.findById(employeeId);
    //Verificar se ele pertence a empresa!
    if(!employee) throw Error("Only registered employeers can have cards!");
    return employee
};
async function validateEmployeeNewCardType(cardType:any, employeeId:number){
    const employeerCardboard : cardRepository.Card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(employeerCardboard) throw Error("Already have that type of card!");
};
//Validations - Activation
async function validateEmployeeCard(cardId:string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[], employeeId:number ) {
    const card : cardRepository.Card = await cardRepository.findById(Number(cardId));
    if(card.employeeId !== employeeId) throw Error("That card don't belong to u!");
}
async function validateCardExpiration(expirationDate: string){
    const actualDate : any = dayjs().format("MM-YYYY");
    const expiration : any = dayjs(expirationDate).format("MM-YYYY");
    if(expiration.diff(actualDate, 'month') <= 0) throw Error("That card is expired");
};
async function validateCardSecurityCode(securityCode:string, CVC:string){
    const decryptedSecurityCode : string = cryptr.decrypt(securityCode);
    if(decryptedSecurityCode !== CVC) throw Error("Wrong card data");
}


