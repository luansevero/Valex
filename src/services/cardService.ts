import { TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";

//Services
    //#Create Card Service
    export async function createCard(apiKey:string, employeeId:number, type:TransactionTypes){
        await validateCompany(apiKey);

        const employeeFullName = await validateEmployee(employeeId);

        await validateEmployeeNewCardType(type, employeeId);

        const employeeCard = employeeCardName(employeeFullName);
    };

//Validations
async function validateCompany(apiKey: string){
    const company = await findByApiKey(apiKey);
    if(!company) throw Error("That key don't belong to any company!");
};
async function validateEmployee(employeeId:number){
    const employee = await findById(employeeId);
    //Verificar se ele pertence a empresa!
    if(!employee) throw Error("Only registered employeers can have cards!");
    return employee["fullName"];
};
async function validateEmployeeNewCardType(cardType:any, employeeId:number){
    const employeerCardboard = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(employeerCardboard) throw Error("Already have that type of card!");
};

//Generate Card
function employeeCardName(employeeFullName:string){
    
}