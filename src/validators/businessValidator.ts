import * as businessRepository from "../repositories/businessRepository.js";

export async function registered(businessId:number){
    const business : businessRepository.Business = await businessRepository.findById(businessId);
    if(!business) throw Error("That business insen't registered")
};