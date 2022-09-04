import * as cardRepository from "../repositories/cardRepository.js";

export async function type(cardType:any, employeeId:number){
    const employeerCardboard : cardRepository.Card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(employeerCardboard) throw Error("Already have that type of card!");
};