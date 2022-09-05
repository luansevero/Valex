import * as employeeRepository from "../repositories/employeeRepository.js";
import { ErrorInfo } from "../middlewares/errorHandlingMiddleware.js";

export async function employee(employeeId:number){
    const employee : employeeRepository.Employee = await employeeRepository.findById(employeeId);
    //Verificar se ele pertence a empresa!
    if(!employee) throw new ErrorInfo("error_conflict", "Only registered employeers can have cards!");
    return employee
};