import * as companyRepository from "../repositories/companyRepository.js";

export default async function validateCompany(apiKey: string){
    const company : companyRepository.Company = await companyRepository.findByApiKey(apiKey);
    if(!company) throw Error("That key don't belong to any company!");
};