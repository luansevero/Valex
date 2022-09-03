import { TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";

//Services
    //#Create Card Service
    export async function createCard(apiKey:string, userId:number, type:TransactionTypes){
        await findByApiKey(apiKey);
    };

//Validations
async function validateCompany(apiKey: string){
    const company = await findByApiKey(apiKey);
    if(!company) throw Error("That key don't belong to any company!");
};