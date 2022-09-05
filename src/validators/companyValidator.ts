import * as companyRepository from "../repositories/companyRepository.js";
import { ErrorInfo } from "../middlewares/errorHandlingMiddleware.js";

export default async function validateCompany(apiKey: string){
    const company : companyRepository.Company = await companyRepository.findByApiKey(apiKey);
    if(!company) throw new ErrorInfo("error_unprocessable_entity", "That key don't belong to any company!");
};