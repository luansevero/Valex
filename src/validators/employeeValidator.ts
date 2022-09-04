import * as employeeRepository from "../repositories/employeeRepository.js";

export async function employee(employeeId:number){
    const employee : employeeRepository.Employee = await employeeRepository.findById(employeeId);
    //Verificar se ele pertence a empresa!
    if(!employee) throw Error("Only registered employeers can have cards!");
    return employee
};