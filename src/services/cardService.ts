import { TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";

//Services
    //#Create Card Service
    export async function createCard(apiKey:string, employeeId:number, type:TransactionTypes){
        await findByApiKey(apiKey);
        const employee = await validateEmployee(employeeId);
    };

//Validations
async function validateCompany(apiKey: string){
    const company = await findByApiKey(apiKey);
    if(!company) throw Error("That key don't belong to any company!");
};
async function validateEmployee(employeeId:number){
    const employeer = await findById(employeeId);
    //Verificar se ele pertence a empresa!
    if(!employeer) throw Error("Only registered employeers can have cards!");
};